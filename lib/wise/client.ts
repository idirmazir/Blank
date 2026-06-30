import type { WiseEnvironment, WiseQuote, WiseRecipient, WiseTransfer, FactoryPaymentDetails } from "./types";

const BASE_URLS: Record<WiseEnvironment, string> = {
  sandbox: "https://api.sandbox.transferwise.tech",
  live: "https://api.wise.com",
};

function getBaseUrl(): string {
  const env = (process.env.WISE_ENVIRONMENT as WiseEnvironment) || "sandbox";
  return BASE_URLS[env];
}

function getHeaders(): HeadersInit {
  const apiKey = process.env.WISE_API_KEY;
  if (!apiKey) {
    throw new Error("WISE_API_KEY is not set");
  }
  return {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };
}

async function wiseRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${getBaseUrl()}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: { ...getHeaders(), ...options.headers },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Wise API error ${res.status}: ${body}`);
  }

  return res.json() as Promise<T>;
}

// 1. Create a quote — get exchange rate + fee
export async function createQuote(
  sourceCurrency: string,
  targetCurrency: string,
  sourceAmount: number,
): Promise<WiseQuote> {
  const profileId = process.env.WISE_PROFILE_ID;
  if (!profileId) {
    throw new Error("WISE_PROFILE_ID is not set");
  }

  const body = {
    sourceCurrency,
    targetCurrency,
    sourceAmount: sourceAmount.toFixed(2),
    profile: parseInt(profileId, 10),
  };

  const data = await wiseRequest<any>("/v2/quotes", {
    method: "POST",
    body: JSON.stringify(body),
  });

  return {
    id: data.id,
    sourceAmount: parseFloat(data.sourceAmount),
    targetAmount: parseFloat(data.targetAmount),
    sourceCurrency: data.sourceCurrency,
    targetCurrency: data.targetCurrency,
    rate: parseFloat(data.rate),
    fee: parseFloat(data.fee?.total || data.fee || 0),
    type: data.type || "REGULAR",
    createdTime: data.createdTime,
    deliveryEstimate: data.deliveryEstimate,
  };
}

// 2. Create a recipient — register factory bank details
export async function createRecipient(
  paymentDetails: FactoryPaymentDetails,
): Promise<WiseRecipient> {
  const profileId = process.env.WISE_PROFILE_ID;

  const body = {
    currency: "CNY",
    type: "iban" in paymentDetails && paymentDetails.iban ? "iban" : "swift_code",
    accountHolderName: paymentDetails.account_holder_name,
    profile: parseInt(profileId!, 10),
    ownedByCustomer: false,
    details: {
      legalType: "PRIVATE",
      ...(paymentDetails.iban
        ? { iban: paymentDetails.iban }
        : { accountNumber: paymentDetails.account_number }),
      swiftCode: paymentDetails.swift_bic,
      bankName: paymentDetails.bank_name,
      ...(paymentDetails.bank_address && { bankAddress: paymentDetails.bank_address }),
      cnapsCode: paymentDetails.cnaps_code,
      province: paymentDetails.province,
      city: paymentDetails.city,
      country: paymentDetails.country,
    },
  };

  const data = await wiseRequest<any>("/v1/accounts", {
    method: "POST",
    body: JSON.stringify(body),
  });

  return {
    id: data.id,
    accountHolderName: data.accountHolderName,
    currency: data.currency,
    type: data.type,
    bankDetails: {
      bankName: paymentDetails.bank_name,
      bankAddress: paymentDetails.bank_address,
      swiftCode: paymentDetails.swift_bic,
      accountNumber: paymentDetails.account_number,
      cnapsCode: paymentDetails.cnaps_code,
    },
    country: paymentDetails.country,
  };
}

// 3. Create a transfer — initiate payment to recipient
export async function createTransfer(
  quoteId: string,
  recipientId: string,
  reference: string,
): Promise<WiseTransfer> {
  const profileId = process.env.WISE_PROFILE_ID;

  const body = {
    targetAccount: recipientId,
    quoteUuid: quoteId,
    details: {
      reference,
      transferPurpose: "verification.transfers.purpose.other",
      sourceOfFunds: "verification.source.of.funds.other",
    },
    customerTransactionId: reference,
  };

  const data = await wiseRequest<any>("/v1/transfers", {
    method: "POST",
    body: JSON.stringify(body),
  });

  return {
    id: data.id,
    reference: data.reference || reference,
    sourceAmount: parseFloat(data.sourceAmount || "0"),
    targetAmount: parseFloat(data.targetAmount || "0"),
    sourceCurrency: data.sourceCurrency || "AUD",
    targetCurrency: data.targetCurrency || "CNY",
    rate: parseFloat(data.rate || "0"),
    fee: 0,
    status: data.status || "incoming_payment_waiting",
    recipientId,
    createdTime: data.createdTime,
  };
}

// 4. Fund a transfer — pay from Wise balance
export async function fundTransfer(transferId: string): Promise<{ type: string; status: string }> {
  const profileId = process.env.WISE_PROFILE_ID;

  const data = await wiseRequest<any>(
    `/v3/profiles/${profileId}/transfers/${transferId}/payments`,
    {
      method: "POST",
      body: JSON.stringify({ type: "BALANCE" }),
    },
  );

  return {
    type: data.type || "BALANCE",
    status: data.status || "COMPLETED",
  };
}

// 5. Get transfer status
export async function getTransferStatus(transferId: string): Promise<{
  status: string;
  recipientId: string;
}> {
  const data = await wiseRequest<any>(`/v1/transfers/${transferId}`);
  return {
    status: data.status,
    recipientId: data.targetAccount,
  };
}
