"use client";

import { Minus, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatAud } from "@/lib/format";
import type { CartItem } from "@/lib/cart/types";
import { useCart } from "@/lib/cart/context";

export function CartLineItem({ item }: { item: CartItem }) {
  const { setQuantity, removeItem } = useCart();
  const atMaxStock = item.quantity >= item.stock;

  return (
    <div className="flex gap-4 py-4 first:pt-0">
      {/* Image */}
      <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-muted">
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.imageUrl}
            alt={item.name}
            className="size-full object-cover"
          />
        ) : null}
      </div>

      {/* Details */}
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <p className="truncate text-sm font-medium">{item.name}</p>
          <p className="shrink-0 text-sm font-medium tabular-nums">
            {formatAud(item.priceCents * item.quantity)}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-7 text-muted-foreground"
              onClick={() => setQuantity(item.productId, item.quantity - 1)}
            >
              <Minus className="size-3" />
            </Button>
            <span className="w-7 text-center text-sm tabular-nums">{item.quantity}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-7 text-muted-foreground"
              disabled={atMaxStock}
              onClick={() => setQuantity(item.productId, item.quantity + 1)}
            >
              <Plus className="size-3" />
            </Button>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-7 text-muted-foreground hover:text-destructive"
            onClick={() => removeItem(item.productId)}
          >
            <X className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
