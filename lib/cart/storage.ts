import type { CartItem } from "@/lib/cart/types";

export const CART_STORAGE_KEY = "blank-cart-v1";

export function readCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Partial<CartItem>[];
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter(
        (item): item is CartItem =>
          typeof item?.productId === "string" &&
          typeof item?.slug === "string" &&
          typeof item?.name === "string" &&
          typeof item?.priceCents === "number" &&
          typeof item?.quantity === "number",
      )
      .map((item) => ({
        ...item,
        imageUrl: item.imageUrl ?? null,
        stock:
          typeof item.stock === "number"
            ? item.stock
            : Math.max(item.quantity ?? 1, 1),
      }));
  } catch {
    return [];
  }
}

export function writeCartToStorage(items: CartItem[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}
