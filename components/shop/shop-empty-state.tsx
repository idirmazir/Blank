import { WaitlistForm } from "@/components/landing/waitlist-form";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ShopEmptyState() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-32 text-center">
      <p className="mb-6 text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
        Coming soon
      </p>
      <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        The first product is being perfected.
      </h2>
      <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
        We&apos;re working directly with manufacturers to bring you essentials
        without the branding, markup, or noise. Join the waitlist to be first
        to know when the collection drops.
      </p>
      <div className="mt-10">
        <WaitlistForm className="mx-auto max-w-md" />
      </div>
    </div>
  );
}
