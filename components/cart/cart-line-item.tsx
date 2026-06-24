"use client";

import { Minus, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatAud } from "@/lib/format";
import type { CartItem } from "@/lib/cart/types";
import { useCart } from "@/lib/cart/context";

export function CartLineItem({ item }: { item: CartItem }) {
  const { setQuantity, removeItem } = useCart();

  const atMaxStock = item.quantity >= item.stock;

  return (
    <div className="flex gap-3 border-b pb-4 last:border-b-0">
      <div className="flex size-16 shrink-0 items-center justify-center rounded-md bg-muted text-xs text-muted-foreground">
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.imageUrl}
            alt={item.name}
            className="size-full rounded-md object-cover"
          />
        ) : (
          "Img"
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div>
          <p className="truncate font-medium">{item.name}</p>
          <p className="text-sm text-muted-foreground">
            {formatAud(item.priceCents)}
          </p>
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => setQuantity(item.productId, item.quantity - 1)}
            >
              <Minus className="size-3" />
            </Button>
            <span className="w-8 text-center text-sm">{item.quantity}</span>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="size-8"
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
            className="size-8 text-muted-foreground"
            onClick={() => removeItem(item.productId)}
          >
            <Trash2 className="size-4" />
            <span className="sr-only">Remove item</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
