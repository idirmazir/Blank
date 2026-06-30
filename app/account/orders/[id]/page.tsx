import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { getOrdersForUser } from "@/lib/db/orders";

export const metadata = { title: "My Orders — Blank" };

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="mx-auto w-full max-w-lg px-4 py-16">
        <Card>
          <CardHeader>
            <CardTitle>Sign in required</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/account/login" className={buttonVariants()}>Sign in</Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Fetch order — only if it belongs to the user
  const { data: order } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (
        *,
        products ( name, slug, image_urls )
      )
    `)
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!order) {
    return (
      <div className="mx-auto w-full max-w-lg px-4 py-16">
        <Card>
          <CardHeader>
            <CardTitle>Order not found</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/account/orders" className={buttonVariants()}>Back to orders</Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Fetch shipment tracking
  const { data: shipments } = await supabase
    .from("order_shipments")
    .select("*")
    .eq("order_id", id);

  const statusSteps = ["paid", "factory_paid", "shipped", "delivered"];
  const currentStep = statusSteps.indexOf(order.status);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 space-y-6">
      <div>
        <Link href="/account/orders" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to orders
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight mt-2">Order {id.slice(0, 8)}</h1>
        <p className="text-sm text-muted-foreground capitalize">{order.status.replace(/_/g, " ")}</p>
      </div>

      {/* Status Timeline */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            {statusSteps.map((step, i) => (
              <div key={step} className="flex flex-col items-center">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium ${
                    i <= currentStep
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {i + 1}
                </div>
                <p className="mt-1 text-xs text-muted-foreground capitalize">{step.replace(/_/g, " ")}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Items */}
      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {order.order_items?.map((item: any) => (
            <div key={item.id} className="flex items-center justify-between text-sm">
              <span>{item.products?.name || "Unknown"} × {item.quantity}</span>
              <span className="text-muted-foreground">${((item.price_cents * item.quantity) / 100).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t pt-2 flex items-center justify-between font-medium">
            <span>Total</span>
            <span>${(order.total_cents / 100).toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Tracking */}
      {shipments && shipments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Tracking</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {shipments.map((s: any) => (
              <div key={s.id} className="text-sm space-y-1">
                <p className="font-medium">{s.tracking_number}</p>
                <p className="text-xs text-muted-foreground capitalize">
                  {s.carrier} · {s.status.replace(/_/g, " ")}
                  {s.estimated_delivery && ` · Est. delivery: ${new Date(s.estimated_delivery).toLocaleDateString()}`}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
