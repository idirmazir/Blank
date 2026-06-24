import type { Product } from "@/types/database";

import type { CartItem } from "./types";

export function productToCartItem(product: Product): Omit<CartItem, "quantity"> {
  return {
    productId: product.id,
    slug: product.slug,
    name: product.name,
    priceCents: product.price_cents,
    imageUrl: product.image_urls[0] ?? null,
    stock: product.stock,
  };
}
