import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { getStripe, retrieveCheckoutSession } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import type Stripe from "stripe";

export async function POST(request: NextRequest) {
  const stripe = getStripe();
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 },
    );
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 },
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    await handleCheckoutCompleted(session);
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const supabase = createAdminClient();

  // Idempotency: check if order already exists for this session
  const { data: existing } = await supabase
    .from("orders")
    .select("id")
    .eq("stripe_session_id", session.id)
    .maybeSingle();

  if (existing) {
    console.log(`Order already exists for session ${session.id}, skipping`);
    return;
  }

  // Retrieve full session with line items
  const fullSession = await retrieveCheckoutSession(session.id);

  if (!fullSession.line_items?.data?.length) {
    console.error("No line items in session", session.id);
    return;
  }

  // Get user ID from metadata
  const userId = session.metadata?.userId || null;
  const email = session.customer_email || session.customer_details?.email || "";

  if (!email) {
    console.error("No customer email in session", session.id);
    return;
  }

  // Shipping address
  const shippingAddress = session.shipping_details?.address
    ? {
        line1: session.shipping_details.address.line1,
        line2: session.shipping_details.address.line2,
        city: session.shipping_details.address.city,
        state: session.shipping_details.address.state,
        postal_code: session.shipping_details.address.postal_code,
        country: session.shipping_details.address.country,
        name: session.shipping_details.name,
      }
    : session.shipping
      ? {
          name: session.shipping.name,
          line1: session.shipping.address?.line1,
          line2: session.shipping.address?.line2,
          city: session.shipping.address?.city,
          state: session.shipping.address?.state,
          postal_code: session.shipping.address?.postal_code,
          country: session.shipping.address?.country,
        }
      : null;

  // Create order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: userId,
      email,
      status: "paid",
      total_cents: session.amount_total || 0,
      stripe_session_id: session.id,
      shipping_address: shippingAddress,
    })
    .select()
    .single();

  if (orderError || !order) {
    console.error("Failed to create order:", orderError);
    return;
  }

  // Create order items + decrement stock
  for (const lineItem of fullSession.line_items.data) {
    // The product ID was stored in metadata when creating the line item
    // We need to match by price_data product name since we used price_data
    const productData = lineItem.price?.product as Stripe.Product;
    const productName = productData?.name;

    if (!productName) continue;

    // Find product by name (since we used price_data, not product ID)
    const { data: product } = await supabase
      .from("products")
      .select("id, stock")
      .eq("name", productName)
      .single();

    if (!product) {
      console.error(`Product not found for line item: ${productName}`);
      continue;
    }

    await supabase.from("order_items").insert({
      order_id: order.id,
      product_id: product.id,
      quantity: lineItem.quantity || 1,
      price_cents: lineItem.price?.unit_amount || 0,
    });

    // Decrement stock
    const { error: stockError } = await supabase.rpc("decrement_product_stock", {
      p_product_id: product.id,
      p_quantity: lineItem.quantity || 1,
    });

    if (stockError) {
      console.error(`Failed to decrement stock for ${product.id}:`, stockError);
    }
  }

  // Log status
  await supabase.rpc("log_order_status", {
    p_order_id: order.id,
    p_to_status: "paid",
    p_reason: "Payment received via Stripe",
  });

  console.log(`Order ${order.id} created for session ${session.id}`);
}
