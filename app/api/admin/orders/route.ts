import { NextRequest, NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/helpers";
import { registerShipment } from "@/lib/orders/shipping";
import { processFactoryPayments } from "@/lib/orders/factory-payment";

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const { action } = body;

    if (action === "register_shipment") {
      const { orderId, trackingNumber, carrier } = body;
      if (!orderId || !trackingNumber || !carrier) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
      }
      await registerShipment(orderId, trackingNumber, carrier);
      return NextResponse.json({ success: true });
    }

    if (action === "retry_factory_payment") {
      const { orderId } = body;
      if (!orderId) {
        return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
      }
      await processFactoryPayments(orderId);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    console.error("Admin orders action error:", error);
    return NextResponse.json({ error: "Action failed" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const supabase = createAdminClient();

    let query = supabase
      .from("orders")
      .select(`
        id,
        email,
        status,
        total_cents,
        created_at,
        order_items (
          id,
          quantity,
          price_cents,
          products ( name, slug )
        )
      `)
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Get orders error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
