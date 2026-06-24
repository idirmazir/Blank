import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

export default function ProductNotFound() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-4 px-4 py-20">
      <h1 className="text-2xl font-semibold">Product not found</h1>
      <p className="text-muted-foreground">
        This item may have been removed or the link is incorrect.
      </p>
      <Link href="/shop" className={buttonVariants()}>
        Back to shop
      </Link>
    </div>
  );
}
