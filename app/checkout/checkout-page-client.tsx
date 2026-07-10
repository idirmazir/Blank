"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { buttonVariants } from "@/components/ui/button";
import { useCart } from "@/lib/cart/context";
import { cn } from "@/lib/utils";

export function CheckoutPageClient() {
  const { items, subtotalCents, isHydrated, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to start checkout");
        setLoading(false);
        return;
      }

      clearCart();
      router.push(data.url);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  if (!isHydrated) {
    return <p className="text-sm text-muted-foreground">Loading…</p>;
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md px-6 py-32 text-center">
        <h2 className="text-xl font-medium tracking-tight">Your cart is empty</h2>
        <p className="mt-3 text-sm text-muted-foreground">Add items before checking out.</p>
        <a href="/shop" className={cn(buttonVariants(), "mt-8 inline-block px-8")}>
          Continue shopping
        </a>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-lg px-6 py-20 sm:px-10">
      <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.35em] text-muted-foreground">
        Checkout
      </p>
      <h1 className="mb-12 text-[clamp(1.5rem,3vw,2rem)] font-medium tracking-tight">
        Complete your order
      </h1>

      <div className="space-y-6">
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.productId} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {item.name} × {item.quantity}
              </span>
              <span className="font-medium tabular-nums">
                ${((item.priceCents * item.quantity) / 100).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-6">
          <span className="text-sm font-medium">Total</span>
          <span className="text-lg font-medium tabular-nums">
            ${(subtotalCents / 100).toFixed(2)}
          </span>
        </div>

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        <button
          onClick={handleCheckout}
          disabled={loading}
          className={cn(buttonVariants(), "w-full justify-center py-3.5")}
        >
          {loading ? "Redirecting…" : "Pay with Stripe"}
        </button>

        <p className="text-center text-xs text-muted-foreground">
          You&apos;ll be redirected to Stripe to complete payment securely.
        </p>
      </div>
    </div>
  );
}
