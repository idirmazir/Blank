import { NextRequest, NextResponse } from "next/server";

import { createCheckoutSession } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

type CheckoutItem = {
  productId: string;
  quantity: number;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const items: CheckoutItem[] = body.items;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "No items in cart" },
        { status: 400 },
      );
    }

    // Validate quantities
    for (const item of items) {
      if (!item.productId || typeof item.quantity !== "number" || item.quantity <= 0) {
        return NextResponse.json(
          { error: "Invalid cart item" },
          { status: 400 },
        );
      }
    }

    // Fetch products from DB to validate price + stock
    const supabase = createAdminClient();
    const productIds = items.map((i) => i.productId);

    const { data: products, error } = await supabase
      .from("products")
      .select("*")
      .in("id", productIds)
      .eq("active", true);

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch products" },
        { status: 500 },
      );
    }

    if (!products || products.length !== productIds.length) {
      return NextResponse.json(
        { error: "One or more products not found or unavailable" },
        { status: 400 },
      );
    }

    // Build line items and validate stock
    const lineItems = [];
    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.productId} not found` },
          { status: 400 },
        );
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}` },
          { status: 400 },
        );
      }

      lineItems.push({
        quantity: item.quantity,
        price_data: {
          currency: product.currency || "aud",
          unit_amount: product.price_cents,
          product_data: {
            name: product.name,
            description: product.description || undefined,
            images: product.image_urls?.length ? [product.image_urls[0]] : undefined,
          },
        },
      });
    }

    // Get origin for success/cancel URLs
    const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;

    // Get user email if logged in
    let customerEmail: string | undefined;
    if (body.email) {
      customerEmail = body.email;
    }

    const session = await createCheckoutSession({
      lineItems,
      customerEmail,
      userId: body.userId,
      origin,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 },
    );
  }
}
