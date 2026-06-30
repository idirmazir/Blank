import { createAdminClient } from "@/lib/supabase/admin";
import { createRefund } from "@/lib/stripe";

/**
 * Returns management.
 * Flow: customer requests → admin approves → ships to factory → factory receives → refund via Stripe
 */

export async function createReturnRequest(
  orderId: string,
  orderItemId: string | null,
  reason: string,
  userId: string,
): Promise<string> {
  const supabase = createAdminClient();

  // Verify order belongs to user
  const { data: order } = await supabase
    .from("orders")
    .select("id, user_id")
    .eq("id", orderId)
    .eq("user_id", userId)
    .single();

  if (!order) {
    throw new Error("Order not found");
  }

  const { data, error } = await supabase
    .from("order_returns")
    .insert({
      order_id: orderId,
      order_item_id: orderItemId,
      reason,
      status: "requested",
    })
    .select("id")
    .single();

  if (error) throw error;
  return data.id;
}

export async function approveReturn(returnId: string, factoryAddress: string): Promise<void> {
  const supabase = createAdminClient();

  await supabase
    .from("order_returns")
    .update({
      status: "approved",
      notes: `Return approved. Ship to factory: ${factoryAddress}`,
    })
    .eq("id", returnId);
}

export async function rejectReturn(returnId: string, reason: string): Promise<void> {
  const supabase = createAdminClient();

  await supabase
    .from("order_returns")
    .update({
      status: "rejected",
      notes: `Return rejected: ${reason}`,
    })
    .eq("id", returnId);
}

export async function markReturnShippedToFactory(
  returnId: string,
  trackingNumber: string,
  carrier: string,
): Promise<void> {
  const supabase = createAdminClient();

  await supabase
    .from("order_returns")
    .update({
      status: "shipped_to_factory",
      return_tracking_number: trackingNumber,
      return_carrier: carrier,
    })
    .eq("id", returnId);
}

export async function markReturnReceivedByFactory(returnId: string): Promise<void> {
  const supabase = createAdminClient();

  await supabase
    .from("order_returns")
    .update({
      status: "received_by_factory",
    })
    .eq("id", returnId);
}

export async function issueRefund(
  returnId: string,
  amountCents: number,
  stripeChargeId: string,
): Promise<string> {
  const supabase = createAdminClient();

  const refund = await createRefund(stripeChargeId, amountCents);

  await supabase
    .from("order_returns")
    .update({
      status: "refunded",
      refund_amount_cents: amountCents,
      refund_id: refund.id,
    })
    .eq("id", returnId);

  return refund.id;
}
