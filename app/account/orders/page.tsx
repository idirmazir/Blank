import type { Metadata } from "next";
import Link from "next/link";

import { OrderCard } from "@/components/account/order-card";
import { buttonVariants } from "@/components/ui/button";
import { getSessionUser } from "@/lib/auth/helpers";
import { getOrdersForUser } from "@/lib/db/orders";
import { formatAud } from "@/lib/format";

export const metadata: Metadata = {
  title: "Orders",
};

export default async function OrdersPage() {
  const user = await getSessionUser();
  const orders = user ? await getOrdersForUser(user.id) : [];

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Your orders</h1>
          <p className="mt-2 text-muted-foreground">
            Signed in as {user?.email}
          </p>
        </div>
        <Link href="/shop" className={buttonVariants({ variant: "outline" })}>
          Continue shopping
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center">
          <p className="font-medium">No orders yet</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Once checkout is live, completed purchases will appear here.
          </p>
          <Link href="/shop" className={buttonVariants({ className: "mt-6" })}>
            Browse shop
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
          <p className="text-sm text-muted-foreground">
            Total lifetime spend:{" "}
            {formatAud(orders.reduce((sum, order) => sum + order.total_cents, 0))}
          </p>
        </div>
      )}
    </div>
  );
}
