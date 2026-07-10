import type { Metadata } from "next";
import { Suspense } from "react";

import { CategoryFilter } from "@/components/shop/category-filter";
import { ProductGrid } from "@/components/shop/product-grid";
import { ShopEmptyState } from "@/components/shop/shop-empty-state";
import {
  getActiveProducts,
  getProductCategories,
} from "@/lib/db/products";
import { formatCategory } from "@/lib/format";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse the full Blank collection.",
};

type ShopPageProps = {
  searchParams: Promise<{ category?: string }>;
};

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { category } = await searchParams;

  const [products, categories] = await Promise.all([
    getActiveProducts(category),
    getProductCategories(),
  ]);

  if (!products || products.length === 0) {
    return <ShopEmptyState />;
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:px-10 sm:py-24">
      <div className="mb-16 space-y-6">
        <div>
          <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.35em] text-muted-foreground">
            Collection
          </p>
          <h1 className="text-[clamp(2rem,4vw,3rem)] font-medium tracking-tight">
            {category ? formatCategory(category) : "All products"}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {category
              ? `Showing ${formatCategory(category)}.`
              : "Browse the full collection."}
          </p>
        </div>
        <Suspense fallback={<div className="h-8 animate-pulse bg-muted" />}>
          <CategoryFilter categories={categories} activeCategory={category} />
        </Suspense>
      </div>
      <ProductGrid products={products} />
    </div>
  );
}
