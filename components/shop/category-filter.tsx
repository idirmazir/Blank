"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import { buttonVariants } from "@/components/ui/button";
import { formatCategory } from "@/lib/format";
import { cn } from "@/lib/utils";

export function CategoryFilter({
  categories,
  activeCategory,
}: {
  categories: string[];
  activeCategory?: string;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function hrefFor(category?: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={hrefFor()}
        className={cn(
          buttonVariants({
            variant: activeCategory ? "outline" : "default",
            size: "sm",
          }),
        )}
      >
        All
      </Link>
      {categories.map((category) => (
        <Link
          key={category}
          href={hrefFor(category)}
          className={cn(
            buttonVariants({
              variant: activeCategory === category ? "default" : "outline",
              size: "sm",
            }),
          )}
        >
          {formatCategory(category)}
        </Link>
      ))}
    </div>
  );
}
