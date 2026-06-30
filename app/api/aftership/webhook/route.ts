import { NextRequest, NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";
import type { AfterShipWebhookPayload } from "@/lib/aftership/types";

/**
 * AfterShip webhook handler.
 * Handles tracking_update events.
 *
 * To set up:
 * 1. Go to AfterShip dashboard → Settings → Notifications
 * 2. Add endpoint: https://shopblank.com.au/api/aftership/webhook
 * 3. Subscribe to: tracking_update
 */
export async function POST(request: NextRequest) {
  try {
    const body: AfterShipWebhookPayload = await request.json();

    if (body.event !== "tracking_update") {
      return NextResponse.json({ received: true });
    }

    const tracking = body.msg?.tracking;
    if (!tracking) {
      return NextResponse.json({ received: true });
    }

    const supabase = createAdminClient();

    // Find shipment by AfterShip ID
    const { data: shipment } = await supabase
      .from("order_shipments")
      .select("id, order_id")
      .eq("aftership_id", tracking.id)
      .maybeSingle();

    if (!shipment) {
      console.log(`No shipment found for AfterShip ID ${tracking.id}`);
      return NextResponse.json({ received: true });
    }

    // Map AfterShip status to our status
    const statusMap: Record<string, string> = {
      pending: "pending",
      info_received: "info_received",
      in_transit: "in_transit",
      out_for_delivery: "out_for_delivery",
      delivered: "delivered",
      delivery_failed: "delivery_failed",
      exception: "exception",
    };

    const mappedStatus = (statusMap[tracking.tracking_status] || tracking.tracking_status) as "pending" | "info_received" | "in_transit" | "out_for_delivery" | "delivered" | "delivery_failed" | "exception";

    await supabase
      .from("order_shipments")
      .update({
        status: mappedStatus,
        shipped_at: tracking.shipped_at,
        delivered_at: tracking.delivered_at,
        estimated_delivery: tracking.estimated_delivery,
      })
      .eq("id", shipment.id);

    // If delivered, update order status
    if (mappedStatus === "delivered") {
      await supabase.rpc("log_order_status", {
        p_order_id: shipment.order_id,
        p_to_status: "delivered",
        p_reason: "Package delivered",
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("AfterShip webhook error:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
