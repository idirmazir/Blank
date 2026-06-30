import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { formatAud } from "@/lib/format";
import type { Product } from "@/types/database";

export function ProductCard({ product }: { product: Product }) {
  const imageUrl = product.image_urls[0];
  const outOfStock = product.stock <= 0;

  return (
    <Link href={`/product/${product.slug}`} className="group block h-full">
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-muted">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50">No image</span>
          </div>
        )}
        {outOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60">
            <span className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">Sold out</span>
          </div>
        )}
      </div>
      <div className="mt-4 space-y-1">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-sm font-medium tracking-tight">{product.name}</p>
          <p className="text-sm font-medium tabular-nums">{formatAud(product.price_cents)}</p>
        </div>
        <p className="line-clamp-1 text-xs text-muted-foreground">{product.description}</p>
      </div>
    </Link>
  );
}
