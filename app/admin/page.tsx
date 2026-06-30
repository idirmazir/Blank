import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getRecentOrders, getRevenueStats, getOrderStats, getPendingActions } from "@/lib/db/admin-stats";

export const metadata = {
  title: "Admin — Blank",
};

export default async function AdminPage() {
  const [stats, revenue, recentOrders, pending] = await Promise.all([
    getOrderStats(),
    getRevenueStats(),
    getRecentOrders(5),
    getPendingActions(),
  ]);

  const statusLabels: Record<string, string> = {
    pending: "Pending",
    paid: "Paid",
    factory_notified: "Factory Notified",
    factory_paid: "Factory Paid",
    shipped: "Shipped",
    delivered: "Delivered",
    returned: "Returned",
    cancelled: "Cancelled",
  };

  const totalPending =
    pending.ordersNeedingPayment.length +
    pending.ordersNeedingShipment.length +
    pending.pendingReturns.length +
    pending.pendingQC.length;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Order pipeline and business overview.</p>
      </div>

      {/* Pending Actions Alert */}
      {totalPending > 0 && (
        <Card className="border-amber-500/50 bg-amber-500/5">
          <CardHeader>
            <CardTitle className="text-amber-700 dark:text-amber-400">
              {totalPending} action{totalPending > 1 ? "s" : ""} needed
            </CardTitle>
            <CardDescription>
              {pending.ordersNeedingPayment.length} orders need factory payment ·{" "}
              {pending.ordersNeedingShipment.length} need shipment ·{" "}
              {pending.pendingReturns.length} returns pending ·{" "}
              {pending.pendingQC.length} QC pending
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Revenue Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Revenue</CardDescription>
            <CardTitle className="text-2xl">
              ${(revenue.totalRevenueCents / 100).toFixed(2)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Factory Cost</CardDescription>
            <CardTitle className="text-2xl">
              ${(revenue.totalFactoryCostCents / 100).toFixed(2)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Gross Margin</CardDescription>
            <CardTitle className="text-2xl">
              {revenue.marginPercent.toFixed(1)}%
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Order Pipeline */}
      <div>
        <h2 className="mb-3 text-lg font-semibold">Order Pipeline</h2>
        <div className="grid gap-2 sm:grid-cols-4 lg:grid-cols-8">
          {Object.entries(statusLabels).map(([status, label]) => (
            <Card key={status} className="p-3">
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="text-xl font-semibold">{stats[status] || 0}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm text-muted-foreground hover:text-foreground">
            View all →
          </Link>
        </div>
        <div className="space-y-2">
          {recentOrders.length === 0 ? (
            <p className="text-sm text-muted-foreground">No orders yet.</p>
          ) : (
            recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className="block"
              >
                <Card className="p-3 hover:bg-accent transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{order.email}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.order_items?.length || 0} item(s) · ${(order.total_cents / 100).toFixed(2)}
                      </p>
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">
                      {statusLabels[order.status] || order.status}
                    </span>
                  </div>
                </Card>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Admin Links */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/admin/factories">
          <Card className="p-4 hover:bg-accent transition-colors">
            <CardTitle className="text-base">Factories</CardTitle>
            <CardDescription>Manage suppliers and payment details</CardDescription>
          </Card>
        </Link>
        <Link href="/admin/orders">
          <Card className="p-4 hover:bg-accent transition-colors">
            <CardTitle className="text-base">Orders</CardTitle>
            <CardDescription>Full order lifecycle management</CardDescription>
          </Card>
        </Link>
        <Link href="/admin/returns">
          <Card className="p-4 hover:bg-accent transition-colors">
            <CardTitle className="text-base">Returns</CardTitle>
            <CardDescription>Approve, track, and refund returns</CardDescription>
          </Card>
        </Link>
        <Link href="/admin/qc">
          <Card className="p-4 hover:bg-accent transition-colors">
            <CardTitle className="text-base">QC</CardTitle>
            <CardDescription>Quality control records and checklists</CardDescription>
          </Card>
        </Link>
      </div>
    </div>
  );
}
