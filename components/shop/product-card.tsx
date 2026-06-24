import Image from "next/image";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatAud } from "@/lib/format";
import type { Product } from "@/types/database";

export function ProductCard({ product }: { product: Product }) {
  const imageUrl = product.image_urls[0];
  const outOfStock = product.stock <= 0;

  return (
    <Link href={`/product/${product.slug}`} className="group block h-full">
      <Card className="h-full transition-shadow hover:shadow-md">
        <div className="relative aspect-[4/5] overflow-hidden bg-muted">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-sm text-muted-foreground">
              No image
            </div>
          )}
          {outOfStock ? (
            <Badge className="absolute left-3 top-3" variant="secondary">
              Sold out
            </Badge>
          ) : null}
        </div>
        <CardHeader className="gap-1">
          <CardTitle className="line-clamp-1">{product.name}</CardTitle>
          <CardDescription className="line-clamp-2">
            {product.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="font-medium">{formatAud(product.price_cents)}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
