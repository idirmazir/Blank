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
      {/* Hero — full viewport, centered, vast whitespace */}
      <section className="relative flex min-h-[92vh] items-center justify-center px-4">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-8 text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
            Blank Collective
          </p>
          <h1 className="text-5xl font-semibold tracking-tight sm:text-7xl md:text-8xl">
            Substance
            <br />
            <span className="text-muted-foreground">over status.</span>
          </h1>
          <p className="mx-auto mt-10 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
            No logos. No slogans. No status symbols.
            <br />
            Only exceptional essentials, sourced directly from the makers.
          </p>
          <div className="mt-12">
            <WaitlistForm className="mx-auto max-w-md" />
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Be first to know when the first product drops.
          </p>
        </div>
      </section>

      {/* Philosophy — alternating light/dark sections, Apple-style rhythm */}
      <section className="border-t bg-black py-32 text-white">
        <div className="mx-auto max-w-4xl px-4">
          <div className="grid gap-16 sm:grid-cols-2">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                The fabric matters.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-white/60">
                The material matters. The construction matters. The maker matters.
                The logo does not.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Quality is the new status.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-white/60">
                For people who would rather own one exceptional thing than ten disposable ones.
                For people who know the difference.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="py-32">
        <div className="mx-auto max-w-4xl px-4">
          <p className="mb-16 text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
            What we believe
          </p>
          <div className="space-y-12">
            {[
              { title: "Fewer, better things", body: "We perfect one product rather than offer twenty mediocre alternatives. Fewer colours. Fewer versions. Fewer decisions." },
              { title: "Direct from makers", body: "No unnecessary intermediaries. No layers of markup disconnected from value. A direct relationship between maker and user." },
              { title: "Intentional consumption", body: "What you choose matters more than what it is called. Confidence is not worn on the outside." },
            ].map((item, i) => (
              <div key={item.title} className="grid grid-cols-[2rem_1fr] gap-6">
                <span className="text-sm font-medium text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-lg font-medium tracking-tight sm:text-xl">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* First Collection — minimal product preview */}
      <section className="border-t bg-muted/30 py-32">
        <div className="mx-auto max-w-5xl px-4">
          <div className="text-center">
            <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
              The first collection
            </p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Essentials, perfected.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
              The perfect T-shirt. The perfect cashmere knit. The perfect tote.
              Objects that improve daily life through quality rather than novelty.
            </p>
          </div>

          <div className="mt-16 grid gap-px overflow-hidden rounded-lg border bg-border sm:grid-cols-3">
            {[
              { name: "Heavyweight Cotton T-Shirt", desc: "The foundation." },
              { name: "Cashmere Crew Neck", desc: "The essential knit." },
              { name: "Canvas Tote", desc: "The everyday carry." },
            ].map((product) => (
              <div key={product.name} className="bg-background p-10 text-center">
                <div className="mb-6 mx-auto h-20 w-20 rounded-full bg-muted" />
                <p className="text-sm font-medium tracking-tight">{product.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">{product.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/shop"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "gap-2")}
            >
              Browse shop
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA — dark, immersive */}
      <section className="border-t bg-black py-32 text-white">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Blank is not empty.
          </h2>
          <p className="mt-4 text-lg text-white/60">
            Blank is full of intention.
          </p>
          <div className="mt-12">
            <WaitlistForm className="mx-auto max-w-md" />
          </div>
        </div>
      </section>
    </div>
  );
}
