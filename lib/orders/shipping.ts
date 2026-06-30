import { createAdminClient } from "@/lib/supabase/admin";
import { createTracking } from "@/lib/aftership/client";

/**
 * Register a shipment when factory provides tracking number.
 * Creates order_shipments record + registers with AfterShip.
 */
export async function registerShipment(
  orderId: string,
  trackingNumber: string,
  carrier: string,
): Promise<void> {
  const supabase = createAdminClient();

  // Idempotency: check if shipment already exists for this tracking number
  const { data: existing } = await supabase
    .from("order_shipments")
    .select("id")
    .eq("tracking_number", trackingNumber)
    .maybeSingle();

  if (existing) {
    console.log(`Shipment already exists for tracking ${trackingNumber}, skipping`);
    return;
  }

  // Register with AfterShip
  let aftershipId: string | null = null;
  try {
    const tracking = await createTracking(trackingNumber, carrier, orderId);
    aftershipId = tracking.id;
  } catch (err) {
    console.error(`AfterShip registration failed for ${trackingNumber}:`, err);
    // Continue anyway — shipment record still created, admin can retry
  }

  // Create shipment record
  await supabase.from("order_shipments").insert({
    order_id: orderId,
    tracking_number: trackingNumber,
    carrier,
    aftership_id: aftershipId,
    status: "info_received",
    shipped_at: new Date().toISOString(),
  });

  // Update order status
  await supabase.rpc("log_order_status", {
    p_order_id: orderId,
    p_to_status: "shipped",
    p_reason: `Shipment registered: ${trackingNumber} via ${carrier}`,
  });

  console.log(`Shipment registered for order ${orderId}: ${trackingNumber}`);
}
