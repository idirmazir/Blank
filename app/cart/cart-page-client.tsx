"use client";

import Link from "next/link";

import { CartLineItem } from "@/components/cart/cart-line-item";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatAud } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/cart/context";

export function CartPageClient() {
  const { items, subtotalCents, isHydrated } = useCart();

  if (!isHydrated) {
    return <p className="text-sm text-muted-foreground">Loading cart…</p>;
  }

  if (items.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your cart is empty</CardTitle>
        </CardHeader>
        <CardContent>
          <Link href="/shop" className={buttonVariants()}>
            Continue shopping
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        {items.map((item) => (
          <CartLineItem key={item.productId} item={item} />
        ))}
      </div>
      <Card className="h-fit">
        <CardHeader>
          <CardTitle>Order summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">{formatAud(subtotalCents)}</span>
          </div>
          <Link
            href="/checkout"
            className={cn(buttonVariants(), "w-full justify-center")}
          >
            Checkout
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
