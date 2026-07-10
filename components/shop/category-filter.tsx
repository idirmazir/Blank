"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

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
    <div className="flex flex-wrap gap-3">
      <Link
        href={hrefFor()}
        className={cn(
          "px-4 py-2 text-xs font-medium uppercase tracking-[0.15em] transition-all",
          activeCategory
            ? "text-muted-foreground hover:text-foreground"
            : "bg-neutral-950 text-white"
        )}
      >
        All
      </Link>
      {categories.map((category) => (
        <Link
          key={category}
          href={hrefFor(category)}
          className={cn(
            "px-4 py-2 text-xs font-medium uppercase tracking-[0.15em] transition-all",
            activeCategory === category
              ? "bg-neutral-950 text-white"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {formatCategory(category)}
        </Link>
      ))}
    </div>
  );
}
