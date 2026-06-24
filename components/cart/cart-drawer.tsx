"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import { CartLineItem } from "@/components/cart/cart-line-item";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
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
          <Button variant="outline" size="icon" className="relative">
            <ShoppingBag className="size-4" />
            {isHydrated && itemCount > 0 ? (
              <Badge className="absolute -right-2 -top-2 size-5 justify-center rounded-full p-0 text-[10px]">
                {itemCount > 99 ? "99+" : itemCount}
              </Badge>
            ) : null}
            <span className="sr-only">Open cart</span>
          </Button>
        }
      />
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Cart</SheetTitle>
          <SheetDescription>
            {isHydrated && items.length === 0
              ? "Your cart is empty."
              : "Review items before checkout."}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-4 overflow-y-auto py-4">
          {isHydrated && items.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Browse the shop and add something you like.
            </p>
          ) : (
            items.map((item) => <CartLineItem key={item.productId} item={item} />)
          )}
        </div>

        <SheetFooter className="border-t pt-4 sm:flex-col sm:items-stretch">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">{formatAud(subtotalCents)}</span>
          </div>
          {isHydrated && items.length > 0 ? (
            <Link
              href="/cart"
              className={cn(buttonVariants(), "w-full justify-center")}
            >
              View cart
            </Link>
          ) : (
            <span
              className={cn(
                buttonVariants(),
                "pointer-events-none w-full justify-center opacity-50",
              )}
            >
              View cart
            </span>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
