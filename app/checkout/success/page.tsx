import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Order Confirmed",
  robots: { index: false, follow: false },
};

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const params = await searchParams;
  const sessionId = params.session_id;

  return (
    <div className="mx-auto w-full max-w-lg px-4 py-16">
      <Card>
        <CardHeader>
          <CardTitle>Order confirmed</CardTitle>
          <CardDescription>
            Thank you. Your order has been received and is being processed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {sessionId && (
            <p className="text-sm text-muted-foreground">
              Reference: <span className="font-mono">{sessionId.slice(-12)}</span>
            </p>
          )}
          <p className="text-sm text-muted-foreground">
            You&apos;ll receive a shipping update once your order is dispatched.
            You can track your order anytime from your account.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/account/orders" className={buttonVariants()}>
              View orders
            </Link>
            <Link href="/shop" className={buttonVariants({ variant: "outline" })}>
              Continue shopping
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
