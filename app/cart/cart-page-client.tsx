"use client";

import Link from "next/link";

import { CartLineItem } from "@/components/cart/cart-line-item";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatAud } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/cart/context";

export function CartPageClient() {
  const { items, subtotalCents, isHydrated, clearCart } = useCart();

  if (!isHydrated) {
    return <p className="text-sm text-muted-foreground">Loading cart…</p>;
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-32 text-center">
        <h2 className="text-xl font-medium tracking-tight">Your cart is empty</h2>
        <p className="text-sm text-muted-foreground">
          When you find something you like, add it here.
        </p>
        <Link href="/shop" className={buttonVariants()}>
          Browse shop
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_320px]">
      {/* Items */}
      <div className="divide-y divide-border/40">
        {items.map((item) => (
          <CartLineItem key={item.productId} item={item} />
        ))}
      </div>

      {/* Summary */}
      <div className="lg:sticky lg:top-20 lg:self-start">
        <Card className="p-6 space-y-4">
          <p className="text-sm font-medium">Order summary</p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium tabular-nums">{formatAud(subtotalCents)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span className="text-muted-foreground">Calculated at checkout</span>
            </div>
          </div>
          <div className="border-t pt-3 flex items-center justify-between">
            <span className="text-sm font-medium">Total</span>
            <span className="text-lg font-semibold tabular-nums">{formatAud(subtotalCents)}</span>
          </div>
          <Link
            href="/checkout"
            className={cn(buttonVariants(), "w-full justify-center")}
          >
            Checkout
          </Link>
          <button
            onClick={clearCart}
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "w-full justify-center text-muted-foreground",
            )}
          >
            Clear cart
          </button>
        </Card>
      </div>
    </div>
  );
}
