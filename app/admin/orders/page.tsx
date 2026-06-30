import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/helpers";

export const metadata = { title: "Orders — Admin" };

export default async function AdminOrdersPage() {
  await requireAdmin();
  const supabase = createAdminClient();

  const { data: orders } = await supabase
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

  const statusColors: Record<string, string> = {
    pending: "text-amber-600",
    paid: "text-blue-600",
    factory_notified: "text-blue-600",
    factory_paid: "text-purple-600",
    shipped: "text-indigo-600",
    delivered: "text-green-600",
    returned: "text-red-600",
    cancelled: "text-red-600",
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Orders</h1>
        <p className="mt-1 text-sm text-muted-foreground">Full order lifecycle management.</p>
      </div>

      {(!orders || orders.length === 0) ? (
        <Card>
          <CardHeader>
            <CardTitle>No orders yet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Orders will appear here once customers start purchasing.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {orders.map((order) => (
            <Link key={order.id} href={`/admin/orders/${order.id}`}>
              <Card className="p-4 hover:bg-accent transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{order.email}</p>
                    <p className="text-xs text-muted-foreground">
                      {order.order_items?.length || 0} item(s) · ${(order.total_cents / 100).toFixed(2)} · {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`text-xs font-medium ${statusColors[order.status] || "text-muted-foreground"}`}>
                    {order.status}
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
