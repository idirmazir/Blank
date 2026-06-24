"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
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
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
      <div className="space-y-4">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
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
            <div className="flex size-full items-center justify-center text-muted-foreground">
              No image
            </div>
          )}
        </div>
        {product.image_urls.length > 1 ? (
          <div className="flex gap-3 overflow-x-auto pb-1">
            {product.image_urls.map((url) => (
              <button
                key={url}
                type="button"
                onClick={() => setActiveImage(url)}
                className={cn(
                  "relative size-20 shrink-0 overflow-hidden rounded-lg ring-2 ring-transparent",
                  activeImage === url && "ring-primary",
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

      <div className="flex flex-col gap-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{formatCategory(product.category)}</Badge>
            {outOfStock ? <Badge variant="secondary">Sold out</Badge> : null}
          </div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {product.name}
          </h1>
          <p className="text-2xl font-medium">{formatAud(product.price_cents)}</p>
          <p className="max-w-prose text-muted-foreground">{product.description}</p>
        </div>

        <div className="space-y-4 rounded-xl border p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Availability</span>
            <span className="font-medium">
              {outOfStock
                ? "Out of stock"
                : `${product.stock} in stock${inCart > 0 ? ` · ${inCart} in cart` : ""}`}
            </span>
          </div>

          {!outOfStock ? (
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center rounded-lg border">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((value) => Math.max(value - 1, 1))}
                >
                  <Minus className="size-4" />
                </Button>
                <span className="w-10 text-center text-sm font-medium">
                  {quantity}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={quantity >= maxSelectable}
                  onClick={() =>
                    setQuantity((value) => Math.min(value + 1, maxSelectable))
                  }
                >
                  <Plus className="size-4" />
                </Button>
              </div>
              <Button
                type="button"
                className="min-w-40"
                disabled={maxSelectable <= 0}
                onClick={handleAddToCart}
              >
                <ShoppingBag className="size-4" />
                Add to cart
              </Button>
            </div>
          ) : null}

          <Link
            href="/cart"
            className={cn(buttonVariants({ variant: "outline" }), "w-full justify-center")}
          >
            View cart
          </Link>
        </div>
      </div>
    </div>
  );
}
