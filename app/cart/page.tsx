import { CartPageClient } from "./cart-page-client";

export default function CartPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-16 sm:px-10 sm:py-20">
      <div className="mb-12">
        <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.35em] text-muted-foreground">
          Cart
        </p>
        <h1 className="text-[clamp(2rem,4vw,3rem)] font-medium tracking-tight">Your cart</h1>
      </div>
      <CartPageClient />
    </div>
  );
}
