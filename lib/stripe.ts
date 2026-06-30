import Stripe from "stripe";

let stripeClient: Stripe | null = null;

export function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }

  if (!stripeClient) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);
  }

  return stripeClient;
}

export async function createCheckoutSession(params: {
  lineItems: Stripe.Checkout.SessionCreateParams.LineItem[];
  customerEmail?: string;
  userId?: string;
  origin: string;
}): Promise<Stripe.Checkout.Session> {
  const stripe = getStripe();

  const metadata: Record<string, string> = {};
  if (params.userId) {
    metadata.userId = params.userId;
  }

  return stripe.checkout.sessions.create({
    mode: "payment",
    line_items: params.lineItems,
    customer_email: params.customerEmail,
    success_url: `${params.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${params.origin}/cart`,
    metadata,
  });
}

export async function retrieveCheckoutSession(sessionId: string) {
  const stripe = getStripe();
  return stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items.data.price.product"],
  });
}

export async function createRefund(chargeId: string, amountCents?: number) {
  const stripe = getStripe();
  return stripe.refunds.create({
    charge: chargeId,
    amount: amountCents,
  });
}
