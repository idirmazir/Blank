import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/helpers";

export const metadata = { title: "Order Detail — Admin" };

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await requireAdmin();
  const supabase = createAdminClient();

  const { data: order } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (
        *,
        products ( name, slug, factory_cost_cents )
      )
    `)
    .eq("id", id)
    .single();

  if (!order) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-10">
        <Card>
          <CardHeader>
            <CardTitle>Order not found</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/admin/orders" className={buttonVariants()}>Back to orders</Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { data: handoffs } = await supabase
    .from("order_factory_handoffs")
    .select("*, factories ( name )")
    .eq("order_id", id);

  const { data: shipments } = await supabase
    .from("order_shipments")
    .select("*")
    .eq("order_id", id);

  const { data: returns } = await supabase
    .from("order_returns")
    .select("*")
    .eq("order_id", id);

  const { data: qcRecords } = await supabase
    .from("qc_records")
    .select("*, factories ( name )")
    .eq("order_id", id);

  const { data: history } = await supabase
    .from("order_status_history")
    .select("*")
    .eq("order_id", id)
    .order("created_at", { ascending: true });

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Order {id.slice(0, 8)}</h1>
          <p className="text-sm text-muted-foreground">{order.email} · {order.status}</p>
        </div>
        <Link href="/admin/orders" className={buttonVariants({ variant: "outline" })}>
          Back
        </Link>
      </div>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {order.order_items?.map((item: any) => (
            <div key={item.id} className="flex items-center justify-between text-sm">
              <span>{item.products?.name || "Unknown"} × {item.quantity}</span>
              <span className="text-muted-foreground">
                ${(item.price_cents / 100).toFixed(2)}
                {item.products?.factory_cost_cents ? ` (cost: $${(item.products.factory_cost_cents / 100).toFixed(2)})` : ""}
              </span>
            </div>
          ))}
          <div className="border-t pt-2 flex items-center justify-between font-medium">
            <span>Total</span>
            <span>${(order.total_cents / 100).toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Factory Handoffs */}
      <Card>
        <CardHeader>
          <CardTitle>Factory Handoffs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {(!handoffs || handoffs.length === 0) ? (
            <p className="text-sm text-muted-foreground">No factory handoffs yet.</p>
          ) : (
            handoffs.map((h: any) => (
              <div key={h.id} className="text-sm space-y-1">
                <p className="font-medium">{h.factories?.name || "Unknown factory"}</p>
                <p className="text-xs text-muted-foreground">
                  Status: {h.status} · Amount: ${(h.payment_amount_cents / 100).toFixed(2) || "N/A"}
                  {h.payment_id && ` · Transfer: ${h.payment_id}`}
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Shipments */}
      <Card>
        <CardHeader>
          <CardTitle>Shipments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {(!shipments || shipments.length === 0) ? (
            <p className="text-sm text-muted-foreground">No shipments registered yet.</p>
          ) : (
            shipments.map((s: any) => (
              <div key={s.id} className="text-sm space-y-1">
                <p className="font-medium">{s.tracking_number}</p>
                <p className="text-xs text-muted-foreground">
                  Carrier: {s.carrier} · Status: {s.status}
                  {s.shipped_at && ` · Shipped: ${new Date(s.shipped_at).toLocaleDateString()}`}
                  {s.delivered_at && ` · Delivered: ${new Date(s.delivered_at).toLocaleDateString()}`}
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Returns */}
      <Card>
        <CardHeader>
          <CardTitle>Returns</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {(!returns || returns.length === 0) ? (
            <p className="text-sm text-muted-foreground">No returns for this order.</p>
          ) : (
            returns.map((r: any) => (
              <div key={r.id} className="text-sm space-y-1">
                <p className="font-medium">{r.reason || "No reason given"}</p>
                <p className="text-xs text-muted-foreground">
                  Status: {r.status}
                  {r.refund_amount_cents && ` · Refund: $${(r.refund_amount_cents / 100).toFixed(2)}`}
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* QC */}
      <Card>
        <CardHeader>
          <CardTitle>QC Records</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {(!qcRecords || qcRecords.length === 0) ? (
            <p className="text-sm text-muted-foreground">No QC records for this order.</p>
          ) : (
            qcRecords.map((qc: any) => (
              <div key={qc.id} className="text-sm space-y-1">
                <p className="font-medium">{qc.qc_type} · {qc.factories?.name}</p>
                <p className="text-xs text-muted-foreground">
                  Status: {qc.status}
                  {qc.inspector && ` · Inspector: ${qc.inspector}`}
                  {qc.notes && ` · ${qc.notes}`}
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Status History */}
      <Card>
        <CardHeader>
          <CardTitle>Status History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {(!history || history.length === 0) ? (
            <p className="text-sm text-muted-foreground">No status history yet.</p>
          ) : (
            history.map((h: any, i: number) => (
              <div key={h.id} className="text-sm space-y-1">
                <p>
                  <span className="text-muted-foreground">{h.from_status || "—"} → </span>
                  <span className="font-medium">{h.to_status}</span>
                </p>
                {h.reason && <p className="text-xs text-muted-foreground">{h.reason}</p>}
                <p className="text-xs text-muted-foreground">{new Date(h.created_at).toLocaleString()}</p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
