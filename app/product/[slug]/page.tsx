import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductDetail } from "@/components/shop/product-detail";
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
    <div className="mx-auto w-full max-w-7xl px-6 py-12 sm:px-10 sm:py-16">
      <div className="mb-12 flex items-center justify-between">
        <Link
          href="/shop"
          className="link-underline text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground"
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
