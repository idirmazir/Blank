import { createAdminClient } from "@/lib/supabase/admin";

export async function getOrderStats() {
  const supabase = createAdminClient();

  const { data: orders } = await supabase
    .from("orders")
    .select("status");

  const stats: Record<string, number> = {};
  for (const order of orders || []) {
    stats[order.status] = (stats[order.status] || 0) + 1;
  }

  return stats;
}

export async function getRevenueStats() {
  const supabase = createAdminClient();

  const { data: orders } = await supabase
    .from("orders")
    .select("total_cents, status, created_at")
    .in("status", ["paid", "factory_paid", "shipped", "delivered"]);

  const totalRevenueCents = orders?.reduce((sum, o) => sum + o.total_cents, 0) || 0;

  // Get factory costs
  const { data: handoffs } = await supabase
    .from("order_factory_handoffs")
    .select("payment_amount_cents")
    .eq("status", "paid");

  const totalFactoryCostCents = handoffs?.reduce((sum, h) => sum + (h.payment_amount_cents || 0), 0) || 0;

  return {
    totalRevenueCents,
    totalFactoryCostCents,
    grossProfitCents: totalRevenueCents - totalFactoryCostCents,
    marginPercent: totalRevenueCents > 0
      ? ((totalRevenueCents - totalFactoryCostCents) / totalRevenueCents) * 100
      : 0,
  };
}

export async function getPendingActions() {
  const supabase = createAdminClient();

  // Orders needing factory payment
  const { data: ordersNeedingPayment } = await supabase
    .from("orders")
    .select("id, email, total_cents, created_at")
    .eq("status", "paid")
    .order("created_at", { ascending: false });

  // Shipments needing tracking numbers
  const { data: ordersNeedingShipment } = await supabase
    .from("orders")
    .select("id, email, created_at")
    .eq("status", "factory_paid")
    .order("created_at", { ascending: false });

  // Returns awaiting approval
  const { data: pendingReturns } = await supabase
    .from("order_returns")
    .select("id, order_id, reason, created_at")
    .eq("status", "requested")
    .order("created_at", { ascending: false });

  // QC pending
  const { data: pendingQC } = await supabase
    .from("qc_records")
    .select("id, order_id, qc_type, created_at")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  return {
    ordersNeedingPayment: ordersNeedingPayment || [],
    ordersNeedingShipment: ordersNeedingShipment || [],
    pendingReturns: pendingReturns || [],
    pendingQC: pendingQC || [],
  };
}

export async function getRecentOrders(limit = 10) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
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
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}
