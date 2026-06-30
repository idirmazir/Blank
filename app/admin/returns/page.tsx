import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/helpers";

export const metadata = { title: "Returns — Admin" };

export default async function AdminReturnsPage() {
  await requireAdmin();
  const supabase = createAdminClient();

  const { data: returns } = await supabase
    .from("order_returns")
    .select(`
      id,
      order_id,
      reason,
      status,
      return_tracking_number,
      return_carrier,
      refund_amount_cents,
      created_at,
      order_returns_order_id_fkey (email)
    `)
    .order("created_at", { ascending: false });

  const statusColors: Record<string, string> = {
    requested: "text-amber-600",
    approved: "text-blue-600",
    rejected: "text-red-600",
    shipped_to_factory: "text-purple-600",
    received_by_factory: "text-indigo-600",
    refunded: "text-green-600",
    closed: "text-muted-foreground",
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Returns</h1>
        <p className="mt-1 text-sm text-muted-foreground">Approve, track, and refund customer returns.</p>
      </div>

      {(!returns || returns.length === 0) ? (
        <Card>
          <CardHeader>
            <CardTitle>No returns yet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Return requests will appear here.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {returns.map((ret) => (
            <Card key={ret.id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{ret.reason || "No reason given"}</p>
                  <p className="text-xs text-muted-foreground">
                    Order: <Link href={`/admin/orders/${ret.order_id}`} className="underline">{ret.order_id.slice(0, 8)}</Link>
                    {ret.refund_amount_cents && ` · Refund: $${(ret.refund_amount_cents / 100).toFixed(2)}`}
                  </p>
                </div>
                <span className={`text-xs font-medium ${statusColors[ret.status] || "text-muted-foreground"}`}>
                  {ret.status}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
