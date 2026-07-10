"use client";

import { Minus, Plus, X } from "lucide-react";

import { formatAud } from "@/lib/format";
import type { CartItem } from "@/lib/cart/types";
import { useCart } from "@/lib/cart/context";

export function CartLineItem({ item }: { item: CartItem }) {
  const { setQuantity, removeItem } = useCart();
  const atMaxStock = item.quantity >= item.stock;

  return (
    <div className="flex gap-5 py-6">
      <div className="relative size-20 shrink-0 overflow-hidden bg-neutral-100">
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.imageUrl}
            alt={item.name}
            className="size-full object-cover"
          />
        ) : null}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          <p className="truncate text-sm font-medium">{item.name}</p>
          <p className="shrink-0 text-sm font-medium tabular-nums">
            {formatAud(item.priceCents * item.quantity)}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="flex size-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setQuantity(item.productId, item.quantity - 1)}
            >
              <Minus className="size-3" />
            </button>
            <span className="w-8 text-center text-sm tabular-nums">{item.quantity}</span>
            <button
              type="button"
              className="flex size-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
              disabled={atMaxStock}
              onClick={() => setQuantity(item.productId, item.quantity + 1)}
            >
              <Plus className="size-3" />
            </button>
          </div>

          <button
            type="button"
            className="flex size-8 items-center justify-center text-muted-foreground transition-colors hover:text-destructive"
            onClick={() => removeItem(item.productId)}
          >
            <X className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
