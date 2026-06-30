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
    <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:py-20">
      <div className="mb-12 space-y-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Shop</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {category
              ? `Showing ${formatCategory(category)}.`
              : "Browse the full collection."}
          </p>
        </div>
        <Suspense fallback={<div className="h-8 animate-pulse rounded-lg bg-muted" />}>
          <CategoryFilter categories={categories} activeCategory={category} />
        </Suspense>
      </div>
      <ProductGrid products={products} />
    </div>
  );
}
