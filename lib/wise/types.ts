export type WiseEnvironment = "sandbox" | "live";

export type WiseQuote = {
  id: string;
  sourceAmount: number;
  targetAmount: number;
  sourceCurrency: string;
  targetCurrency: string;
  rate: number;
  fee: number;
  type: string;
  createdTime: string;
  deliveryEstimate: string;
};

export type WiseRecipient = {
  id: string;
  accountHolderName: string;
  currency: string;
  type: string;
  bankDetails: {
    bankName?: string;
    bankAddress?: string;
    swiftCode?: string;
    accountNumber?: string;
    iban?: string;
    cnapsCode?: string;
  };
  country: string;
};

export type WiseTransfer = {
  id: string;
  reference: string;
  sourceAmount: number;
  targetAmount: number;
  sourceCurrency: string;
  targetCurrency: string;
  rate: number;
  fee: number;
  status: string;
  recipientId: string;
  createdTime: string;
};

export type FactoryPaymentDetails = {
  account_holder_name: string;
  account_number?: string;
  iban?: string;
  swift_bic: string;
  bank_name: string;
  bank_address?: string;
  cnaps_code: string;
  province: string;
  city: string;
  country: string;
};
