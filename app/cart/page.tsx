import { CartPageClient } from "./cart-page-client";

export default function CartPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Cart</h1>
        <p className="mt-2 text-muted-foreground">
          Review your items before checkout.
        </p>
      </div>
      <CartPageClient />
    </div>
  );
}
