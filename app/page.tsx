import Link from "next/link";

import { ProductGrid } from "@/components/shop/product-grid";
import { buttonVariants } from "@/components/ui/button";
import { getFeaturedProducts } from "@/lib/db/products";

export default async function Home() {
  const featured = await getFeaturedProducts(4);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-16">
      <section className="mx-auto flex max-w-2xl flex-col gap-6">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Blank storefront
        </p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Simple shop. Fast checkout.
        </h1>
        <p className="text-lg text-muted-foreground">
          Essentials for everyday life — curated pieces with a clean shopping
          experience. Checkout arrives when Stripe is connected.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/shop" className={buttonVariants({ size: "lg" })}>
            Browse shop
          </Link>
          <Link
            href="/cart"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            View cart
          </Link>
        </div>
      </section>

      <section className="mt-16 space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Featured</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              A few favourites from the catalog.
            </p>
          </div>
          <Link
            href="/shop"
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            View all
          </Link>
        </div>
        <ProductGrid products={featured} />
      </section>
    </div>
  );
}
