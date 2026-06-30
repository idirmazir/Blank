"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

      // Redirect to Stripe Checkout
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
      <Card>
        <CardHeader>
          <CardTitle>Your cart is empty</CardTitle>
          <CardDescription>Add items before checking out.</CardDescription>
        </CardHeader>
        <CardContent>
          <a href="/shop" className={buttonVariants()}>
            Continue shopping
          </a>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mx-auto w-full max-w-lg px-4 py-16">
      <Card>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
          <CardDescription>
            You&apos;ll be redirected to Stripe to complete your payment securely.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.productId} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {item.name} × {item.quantity}
                </span>
                <span className="font-medium">
                  ${((item.priceCents * item.quantity) / 100).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 flex items-center justify-between">
            <span className="text-sm font-medium">Total</span>
            <span className="text-lg font-semibold">
              ${(subtotalCents / 100).toFixed(2)}
            </span>
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <button
            onClick={handleCheckout}
            disabled={loading}
            className={cn(buttonVariants(), "w-full justify-center")}
          >
            {loading ? "Redirecting…" : "Pay with Stripe"}
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
