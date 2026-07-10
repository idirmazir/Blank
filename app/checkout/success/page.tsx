import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
    <div className="mx-auto flex min-h-[60vh] w-full max-w-lg flex-col items-center justify-center px-6 py-20 text-center sm:px-10">
      <div className="animate-scale-in flex size-16 items-center justify-center rounded-full bg-neutral-950">
        <svg className="size-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="animate-fade-up delay-100 mt-8 text-[clamp(1.5rem,3vw,2rem)] font-medium tracking-tight">
        Order confirmed
      </h1>
      <p className="animate-fade-up delay-200 mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
        Thank you. Your order has been received and is being processed.
        You&apos;ll receive a shipping update once dispatched.
      </p>
      {sessionId && (
        <p className="animate-fade-up delay-300 mt-6 text-xs text-muted-foreground">
          Reference: <span className="font-mono">{sessionId.slice(-12)}</span>
        </p>
      )}
      <div className="animate-fade-up delay-400 mt-10 flex flex-wrap justify-center gap-3">
        <Link href="/account/orders" className={cn(buttonVariants(), "px-8")}>
          View orders
        </Link>
        <Link href="/shop" className={cn(buttonVariants({ variant: "outline" }), "px-8")}>
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
