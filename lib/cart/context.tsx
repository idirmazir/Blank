"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";

import {
  readCartFromStorage,
  writeCartToStorage,
} from "@/lib/cart/storage";
import type { CartItem } from "@/lib/cart/types";

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotalCents: number;
  isHydrated: boolean;
  addItem: (
    item: Omit<CartItem, "quantity">,
    quantity?: number,
    options?: { silent?: boolean },
  ) => boolean;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => boolean;
  clearCart: () => void;
  getQuantityInCart: (productId: string) => number;
};

const CartContext = createContext<CartContextValue | null>(null);

function capQuantity(stock: number, quantity: number) {
  if (stock <= 0 || quantity <= 0) {
    return 0;
  }

  return Math.min(quantity, stock);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setItems(readCartFromStorage());
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    writeCartToStorage(items);
  }, [items, isHydrated]);

  const getQuantityInCart = useCallback(
    (productId: string) =>
      items.find((line) => line.productId === productId)?.quantity ?? 0,
    [items],
  );

  const addItem = useCallback(
    (
      item: Omit<CartItem, "quantity">,
      quantity = 1,
      options?: { silent?: boolean },
    ) => {
      let added = false;

      setItems((current) => {
        const existing = current.find((line) => line.productId === item.productId);
        const existingQuantity = existing?.quantity ?? 0;
        const nextQuantity = capQuantity(item.stock, existingQuantity + quantity);

        if (nextQuantity <= existingQuantity) {
          return current;
        }

        added = true;

        if (existing) {
          return current.map((line) =>
            line.productId === item.productId
              ? {
                  ...line,
                  ...item,
                  quantity: nextQuantity,
                }
              : line,
          );
        }

        const initialQuantity = capQuantity(item.stock, quantity);
        if (initialQuantity <= 0) {
          added = false;
          return current;
        }

        return [...current, { ...item, quantity: initialQuantity }];
      });

      if (!options?.silent) {
        if (added) {
          toast.success("Added to cart", { description: item.name });
        } else {
          toast.error("Could not add to cart", {
            description:
              item.stock <= 0
                ? "This item is out of stock."
                : "Maximum available quantity is already in your cart.",
          });
        }
      }

      return added;
    },
    [],
  );

  const removeItem = useCallback((productId: string) => {
    setItems((current) => current.filter((line) => line.productId !== productId));
  }, []);

  const setQuantity = useCallback((productId: string, quantity: number) => {
    let updated = false;

    setItems((current) => {
      const line = current.find((entry) => entry.productId === productId);
      if (!line) return current;

      if (quantity <= 0) {
        updated = true;
        return current.filter((entry) => entry.productId !== productId);
      }

      const capped = Math.min(quantity, line.stock);
      if (capped === line.quantity) {
        updated = capped !== quantity;
        return current;
      }

      updated = true;
      return current.map((entry) =>
        entry.productId === productId ? { ...entry, quantity: capped } : entry,
      );
    });

    if (!updated && quantity > 0) {
      toast.error("Maximum stock reached");
    }

    return updated;
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const value = useMemo(() => {
    const itemCount = items.reduce((sum, line) => sum + line.quantity, 0);
    const subtotalCents = items.reduce(
      (sum, line) => sum + line.priceCents * line.quantity,
      0,
    );

    return {
      items,
      itemCount,
      subtotalCents,
      isHydrated,
      addItem,
      removeItem,
      setQuantity,
      clearCart,
      getQuantityInCart,
    };
  }, [
    items,
    isHydrated,
    addItem,
    removeItem,
    setQuantity,
    clearCart,
    getQuantityInCart,
  ]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
}
