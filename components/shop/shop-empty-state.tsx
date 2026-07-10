import { WaitlistForm } from "@/components/landing/waitlist-form";

export function ShopEmptyState() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 py-32 text-center">
      <p className="animate-fade-up mb-8 text-[10px] font-medium uppercase tracking-[0.35em] text-muted-foreground">
        Coming soon
      </p>
      <h2 className="animate-fade-up delay-100 text-[clamp(1.75rem,4vw,2.5rem)] font-medium tracking-tight">
        The first product is being perfected.
      </h2>
      <p className="animate-fade-up delay-200 mx-auto mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
        We&apos;re working directly with manufacturers to bring you essentials
        without the branding, markup, or noise. Join the waitlist to be first
        to know when the collection drops.
      </p>
      <div className="animate-fade-up delay-400 mt-12 w-full max-w-sm">
        <WaitlistForm className="w-full" />
      </div>
    </div>
  );
}
