import type { Metadata } from "next";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

export default function CheckoutPlaceholderPage() {
  return (
    <div className="mx-auto w-full max-w-lg px-4 py-16">
      <Card>
        <CardHeader>
          <CardTitle>Checkout coming soon</CardTitle>
          <CardDescription>
            Payments are not wired up yet. Stripe setup lands in the next phase
            once the site is deployed.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Link href="/cart" className={buttonVariants({ variant: "outline" })}>
            Back to cart
          </Link>
          <Link href="/shop" className={buttonVariants()}>
            Continue shopping
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
