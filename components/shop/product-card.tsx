import Image from "next/image";
import Link from "next/link";

import { formatAud } from "@/lib/format";
import type { Product } from "@/types/database";

export function ProductCard({ product }: { product: Product }) {
  const imageUrl = product.image_urls[0];
  const outOfStock = product.stock <= 0;

  return (
    <Link href={`/product/${product.slug}`} className="group block h-full">
      <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/30">No image</span>
          </div>
        )}
        {outOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Sold out</span>
          </div>
        )}
      </div>
      <div className="mt-5 flex items-baseline justify-between gap-3">
        <p className="text-sm font-medium tracking-tight">{product.name}</p>
        <p className="text-sm font-medium tabular-nums text-muted-foreground">{formatAud(product.price_cents)}</p>
      </div>
      <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{product.description}</p>
    </Link>
  );
}
