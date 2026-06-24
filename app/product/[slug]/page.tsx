import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductDetail } from "@/components/shop/product-detail";
import { buttonVariants } from "@/components/ui/button";
import { getProductBySlug } from "@/lib/db/products";
import { formatAud } from "@/lib/format";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Product not found" };
  }

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.image_urls[0] ? [product.image_urls[0]] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/shop"
          className={buttonVariants({ variant: "ghost", size: "sm" })}
        >
          ← Back to shop
        </Link>
        <p className="text-sm text-muted-foreground">
          {formatAud(product.price_cents)}
        </p>
      </div>
      <ProductDetail product={product} />
    </div>
  );
}
