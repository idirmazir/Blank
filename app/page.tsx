import Link from "next/link";

import { WaitlistForm } from "@/components/landing/waitlist-form";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Blank — Substance over status.",
  description: "No logos. No slogans. No status symbols. Only substance. Blank curates exceptional essentials sourced directly from manufacturers.",
};

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/30" />
        <div className="relative z-10 mx-auto max-w-2xl px-4 text-center">
          <p className="mb-6 text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
            Blank Collective
          </p>
          <h1 className="text-5xl font-semibold tracking-tight sm:text-7xl">
            Substance
            <br />
            <span className="text-muted-foreground">over status.</span>
          </h1>
          <p className="mx-auto mt-8 max-w-md text-lg text-muted-foreground">
            No logos. No slogans. No status symbols.
            <br />
            Only exceptional essentials, sourced directly from the makers.
          </p>
          <div className="mt-10">
            <WaitlistForm className="mx-auto max-w-md" />
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Be first to know when the first product drops.
          </p>
        </div>
      </section>

      {/* Philosophy */}
      <section className="border-t py-24">
        <div className="mx-auto max-w-4xl px-4">
          <div className="grid gap-12 sm:grid-cols-2 sm:gap-16">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                The fabric matters.
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                The material matters. The construction matters. The maker matters.
                The logo does not.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                Quality is the new status.
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                For people who would rather own one exceptional thing than ten disposable ones.
                For people who know the difference.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="border-t bg-muted/30 py-24">
        <div className="mx-auto max-w-4xl px-4">
          <p className="mb-12 text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
            What we believe
          </p>
          <div className="space-y-8">
            {[
              { title: "Fewer, better things", body: "We perfect one product rather than offer twenty mediocre alternatives. Fewer colours. Fewer versions. Fewer decisions." },
              { title: "Direct from makers", body: "No unnecessary intermediaries. No layers of markup disconnected from value. A direct relationship between maker and user." },
              { title: "Intentional consumption", body: "What you choose matters more than what it is called. Confidence is not worn on the outside." },
            ].map((item) => (
              <div key={item.title} className="flex flex-col gap-2 border-l-2 border-foreground/10 pl-6">
                <h3 className="text-lg font-medium">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* First Collection */}
      <section className="border-t py-24">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
            The first collection
          </p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Essentials, perfected.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-muted-foreground">
            The perfect T-shirt. The perfect cashmere knit. The perfect tote.
            Objects that improve daily life through quality rather than novelty.
          </p>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {["Heavyweight Cotton T-Shirt", "Cashmere Crew Neck", "Canvas Tote"].map((product) => (
              <div key={product} className="rounded-lg border p-6 text-center">
                <div className="mb-4 mx-auto h-16 w-16 rounded-full bg-muted" />
                <p className="text-sm font-medium">{product}</p>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <Link
              href="/shop"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "gap-2")}
            >
              Browse shop
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t bg-foreground py-24 text-background">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Blank is not empty.
          </h2>
          <p className="mt-4 text-lg text-background/70">
            Blank is full of intention.
          </p>
          <div className="mt-10">
            <WaitlistForm className="mx-auto max-w-md" />
          </div>
        </div>
      </section>
    </div>
  );
}
