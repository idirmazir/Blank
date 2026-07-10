"use client";

import Link from "next/link";

import { CartLineItem } from "@/components/cart/cart-line-item";
import { buttonVariants } from "@/components/ui/button";
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
      <div className="mx-auto flex max-w-md flex-col items-center gap-6 py-32 text-center">
        <h2 className="text-xl font-medium tracking-tight">Your cart is empty</h2>
        <p className="text-sm text-muted-foreground">
          When you find something you like, add it here.
        </p>
        <Link href="/shop" className={cn(buttonVariants(), "px-8")}>
          Browse shop
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-16 lg:grid-cols-[1fr_320px]">
      <div className="space-y-1">
        {items.map((item) => (
          <CartLineItem key={item.productId} item={item} />
        ))}
      </div>

      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="space-y-6 py-6">
          <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
            Order summary
          </p>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium tabular-nums">{formatAud(subtotalCents)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span className="text-muted-foreground">Calculated at checkout</span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-4">
            <span className="text-sm font-medium">Total</span>
            <span className="text-lg font-medium tabular-nums">{formatAud(subtotalCents)}</span>
          </div>
          <Link
            href="/checkout"
            className={cn(buttonVariants(), "w-full justify-center py-3.5")}
          >
            Checkout
          </Link>
          <button
            onClick={clearCart}
            className="link-underline w-full text-center text-xs text-muted-foreground"
          >
            Clear cart
          </button>
        </div>
      </div>
    </div>
  );
}
