import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { OrderWithItems } from "@/lib/db/orders";
import { formatAud } from "@/lib/format";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function statusVariant(status: string) {
  switch (status) {
    case "paid":
      return "default" as const;
    case "shipped":
      return "secondary" as const;
    case "cancelled":
      return "destructive" as const;
    default:
      return "outline" as const;
  }
}

export function OrderCard({ order }: { order: OrderWithItems }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="text-base">
            Order {order.id.slice(0, 8).toUpperCase()}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {formatDate(order.created_at)}
          </p>
        </div>
        <Badge variant={statusVariant(order.status)}>{order.status}</Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        <ul className="space-y-2 text-sm">
          {order.order_items.map((item) => (
            <li key={item.id} className="flex justify-between gap-4">
              <span>
                {item.quantity}×{" "}
                {item.products ? (
                  <Link
                    href={`/product/${item.products.slug}`}
                    className="underline-offset-4 hover:underline"
                  >
                    {item.products.name}
                  </Link>
                ) : (
                  "Product"
                )}
              </span>
              <span>{formatAud(item.price_cents * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between border-t pt-3 text-sm font-medium">
          <span>Total</span>
          <span>{formatAud(order.total_cents)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
