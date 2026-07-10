"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag } from "lucide-react";

import { productToCartItem } from "@/lib/cart/product-to-cart-item";
import { useCart } from "@/lib/cart/context";
import { formatAud, formatCategory } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/database";

export function ProductDetail({ product }: { product: Product }) {
  const { addItem, getQuantityInCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(product.image_urls[0] ?? null);

  const inCart = getQuantityInCart(product.id);
  const remainingStock = Math.max(product.stock - inCart, 0);
  const outOfStock = product.stock <= 0;
  const maxSelectable = Math.max(remainingStock, 0);

  function handleAddToCart() {
    if (outOfStock || maxSelectable <= 0) return;
    addItem(productToCartItem(product), Math.min(quantity, maxSelectable));
  }

  return (
    <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
      {/* Images */}
      <div className="space-y-4">
        <div className="relative aspect-square overflow-hidden bg-neutral-100">
          {activeImage ? (
            <Image
              src={activeImage}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-muted-foreground/30">
              <span className="text-[10px] uppercase tracking-[0.2em]">No image</span>
            </div>
          )}
        </div>
        {product.image_urls.length > 1 ? (
          <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
            {product.image_urls.map((url) => (
              <button
                key={url}
                type="button"
                onClick={() => setActiveImage(url)}
                className={cn(
                  "relative size-20 shrink-0 overflow-hidden transition-all",
                  activeImage === url ? "ring-1 ring-neutral-900" : "opacity-50 hover:opacity-100"
                )}
              >
                <Image
                  src={url}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {/* Details */}
      <div className="flex flex-col gap-8 lg:py-4">
        <div className="space-y-4">
          <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
            {formatCategory(product.category)}
          </p>
          <h1 className="text-[clamp(1.75rem,3vw,2.5rem)] font-medium leading-tight tracking-tight">
            {product.name}
          </h1>
          <p className="text-xl font-medium tabular-nums">{formatAud(product.price_cents)}</p>
          <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">{product.description}</p>
        </div>

        {!outOfStock ? (
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center bg-neutral-100">
              <button
                type="button"
                disabled={quantity <= 1}
                onClick={() => setQuantity((v) => Math.max(v - 1, 1))}
                className="flex size-11 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
              >
                <Minus className="size-3.5" />
              </button>
              <span className="w-10 text-center text-sm font-medium tabular-nums">
                {quantity}
              </span>
              <button
                type="button"
                disabled={quantity >= maxSelectable}
                onClick={() => setQuantity((v) => Math.min(v + 1, maxSelectable))}
                className="flex size-11 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
              >
                <Plus className="size-3.5" />
              </button>
            </div>
            <button
              type="button"
              disabled={maxSelectable <= 0}
              onClick={handleAddToCart}
              className="group flex min-w-44 items-center justify-center gap-2 bg-neutral-950 px-8 py-3.5 text-xs font-medium uppercase tracking-[0.15em] text-white transition-all hover:bg-neutral-800 disabled:opacity-40"
            >
              <ShoppingBag className="size-3.5" />
              Add to cart
            </button>
          </div>
        ) : (
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Currently sold out
          </p>
        )}

        {inCart > 0 && (
          <Link
            href="/cart"
            className="link-underline text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground"
          >
            View cart ({inCart})
          </Link>
        )}
      </div>
    </div>
  );
}
