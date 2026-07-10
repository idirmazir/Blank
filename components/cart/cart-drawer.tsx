"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import { CartLineItem } from "@/components/cart/cart-line-item";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { formatAud } from "@/lib/format";
import { useCart } from "@/lib/cart/context";

export function CartDrawer() {
  const { items, subtotalCents, itemCount, isHydrated } = useCart();

  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingBag className="size-[18px]" />
            {isHydrated && itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-foreground text-[9px] font-medium text-background">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
            <span className="sr-only">Open cart</span>
          </Button>
        }
      />
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-sm font-medium tracking-tight">
            Cart {isHydrated && itemCount > 0 && (
              <span className="ml-1 text-muted-foreground">({itemCount})</span>
            )}
          </SheetTitle>
        </SheetHeader>

        {isHydrated && items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6">
            <div className="flex size-12 items-center justify-center bg-neutral-100">
              <ShoppingBag className="size-5 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">Your cart is empty.</p>
            <Link href="/shop" className={cn(buttonVariants({ variant: "outline", size: "sm" }), "px-6")}>
              Browse shop
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto">
              {items.map((item) => (
                <CartLineItem key={item.productId} item={item} />
              ))}
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="text-base font-medium tabular-nums">
                  {formatAud(subtotalCents)}
                </span>
              </div>
              <Link
                href="/checkout"
                className={cn(buttonVariants(), "w-full justify-center py-3.5")}
              >
                Checkout
              </Link>
              <Link
                href="/cart"
                className="link-underline w-full text-center text-xs text-muted-foreground"
              >
                View full cart
              </Link>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
