import { createAdminClient } from "@/lib/supabase/admin";
import { createQuote, createTransfer, fundTransfer, getTransferStatus } from "@/lib/wise/client";

type OrderWithItems = {
  id: string;
  stripe_session_id: string | null;
  order_items: Array<{
    product_id: string;
    quantity: number;
    products: {
      factory_id: string | null;
      factory_cost_cents: number;
      name: string;
    } | null;
  }>;
};

type FactoryGroup = {
  factoryId: string;
  totalCostCents: number;
  items: Array<{ productName: string; quantity: number; costCents: number }>;
};

/**
 * Process factory payments for an order.
 * - Groups items by factory
 * - Creates Wise quote + transfer for each factory
 * - Records handoff in order_factory_handoffs
 * - Idempotent: skips if handoff already exists
 */
export async function processFactoryPayments(orderId: string): Promise<void> {
  const supabase = createAdminClient();

  // Fetch order with items + product factory info
  const { data: order, error } = await supabase
    .from("orders")
    .select(`
      id,
      stripe_session_id,
      order_items (
        product_id,
        quantity,
        products (
          factory_id,
          factory_cost_cents,
          name
        )
      )
    `)
    .eq("id", orderId)
    .single();

  if (error || !order) {
    console.error("Failed to fetch order for factory payment:", error);
    return;
  }

  const typedOrder = order as unknown as OrderWithItems;

  // Group items by factory
  const factoryGroups = new Map<string, FactoryGroup>();

  for (const item of typedOrder.order_items) {
    if (!item.products?.factory_id) {
      console.warn(`Product ${item.product_id} has no factory assigned, skipping`);
      continue;
    }

    if (item.products.factory_cost_cents <= 0) {
      console.warn(`Product ${item.product_id} has no factory cost set, skipping`);
      continue;
    }

    const factoryId = item.products.factory_id;
    const lineCost = item.products.factory_cost_cents * item.quantity;

    if (!factoryGroups.has(factoryId)) {
      factoryGroups.set(factoryId, {
        factoryId,
        totalCostCents: 0,
        items: [],
      });
    }

    const group = factoryGroups.get(factoryId)!;
    group.totalCostCents += lineCost;
    group.items.push({
      productName: item.products.name,
      quantity: item.quantity,
      costCents: item.products.factory_cost_cents,
    });
  }

  if (factoryGroups.size === 0) {
    console.log(`No factories to pay for order ${orderId}`);
    return;
  }

  // Process each factory payment
  for (const [factoryId, group] of factoryGroups) {
    // Idempotency: check if handoff already exists
    const { data: existingHandoff } = await supabase
      .from("order_factory_handoffs")
      .select("id, status")
      .eq("order_id", orderId)
      .eq("factory_id", factoryId)
      .maybeSingle();

    if (existingHandoff) {
      console.log(`Handoff already exists for order ${orderId}, factory ${factoryId}, skipping`);
      continue;
    }

    try {
      // Create Wise quote (AUD → CNY)
      const quote = await createQuote("AUD", "CNY", group.totalCostCents / 100);

      // Create Wise transfer
      const reference = `BLANK-${orderId.slice(0, 8)}-${factoryId.slice(0, 8)}`;
      const transfer = await createTransfer(quote.id, factoryId, reference);

      // Fund the transfer from Wise balance
      await fundTransfer(transfer.id);

      // Record handoff
      await supabase.from("order_factory_handoffs").insert({
        order_id: orderId,
        factory_id: factoryId,
        status: "paid",
        payment_id: transfer.id,
        payment_amount_cents: group.totalCostCents,
        payment_currency: "aud",
        payment_status: transfer.status,
        paid_at: new Date().toISOString(),
        notes: `Factory payment for: ${group.items.map((i) => `${i.productName} x${i.quantity}`).join(", ")}`,
      });

      // Log order status
      await supabase.rpc("log_order_status", {
        p_order_id: orderId,
        p_to_status: "factory_paid",
        p_reason: `Factory ${factoryId} paid via Wise (transfer ${transfer.id})`,
      });

      console.log(`Factory payment completed: order ${orderId}, factory ${factoryId}, transfer ${transfer.id}`);
    } catch (err) {
      console.error(`Factory payment failed for order ${orderId}, factory ${factoryId}:`, err);

      // Record failed attempt
      await supabase.from("order_factory_handoffs").insert({
        order_id: orderId,
        factory_id: factoryId,
        status: "pending",
        payment_amount_cents: group.totalCostCents,
        payment_currency: "aud",
        notes: `Payment failed: ${err instanceof Error ? err.message : "Unknown error"}`,
      });
    }
  }
}

/**
 * Check Wise transfer status for pending handoffs.
 * Called by webhook or polling.
 */
export async function checkPendingTransfers(): Promise<void> {
  const supabase = createAdminClient();

  const { data: pendingHandoffs } = await supabase
    .from("order_factory_handoffs")
    .select("id, order_id, factory_id, payment_id")
    .eq("status", "notified")
    .not("payment_id", "is", null);

  if (!pendingHandoffs) return;

  for (const handoff of pendingHandoffs) {
    if (!handoff.payment_id) continue;

    try {
      const { status } = await getTransferStatus(handoff.payment_id);

      if (status === "outgoing_payment_sent") {
        await supabase
          .from("order_factory_handoffs")
          .update({
            status: "paid",
            payment_status: status,
            paid_at: new Date().toISOString(),
          })
          .eq("id", handoff.id);
      } else if (status === "funds_refunded" || status === "cancelled") {
        await supabase
          .from("order_factory_handoffs")
          .update({
            status: "rejected",
            payment_status: status,
          })
          .eq("id", handoff.id);
      }
    } catch (err) {
      console.error(`Failed to check transfer status for handoff ${handoff.id}:`, err);
    }
  }
}
