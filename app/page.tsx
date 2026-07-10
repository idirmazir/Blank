import { WaitlistForm } from "@/components/landing/waitlist-form";

export const metadata = {
  title: "Blank — $89 Grade A Mongolian Cashmere",
  description:
    "Same factories as $350+ brands. Without the label tax. Join the waitlist for first access.",
};

const PRICE_COMPARISON = [
  { brand: "Scanlan Theodore", price: "$530" },
  { brand: "Witchery", price: "$349" },
  { brand: "Country Road", price: "$299" },
  { brand: "Blank", price: "$89", highlight: true },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-8 text-[10px] font-medium uppercase tracking-[0.4em] text-muted-foreground">
            Coming 2026
          </p>
          <h1 className="text-[clamp(2.5rem,8vw,6rem)] font-medium leading-[0.92] tracking-tight">
            Grade A Mongolian
            <br />
            <span className="text-muted-foreground">Cashmere. $89.</span>
          </h1>
          <p className="mx-auto mt-8 max-w-lg text-sm leading-relaxed text-muted-foreground">
            The same factories that produce for $350+ brands. The same Grade A
            Mongolian yarn. Without the label tax, the retail markup, or the
            bullshit.
          </p>

          {/* Price comparison */}
          <div className="mx-auto mt-12 max-w-xs">
            <div className="space-y-1.5">
              {PRICE_COMPARISON.map((item) => (
                <div
                  key={item.brand}
                  className={`flex items-center justify-between px-4 py-2.5 text-xs ${
                    item.highlight
                      ? "bg-neutral-950 text-white font-medium"
                      : "bg-neutral-50 text-muted-foreground"
                  }`}
                >
                  <span>{item.brand}</span>
                  <span className="tabular-nums">{item.price}</span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[10px] text-muted-foreground/50">
              100% Grade A Mongolian cashmere. 4-ply. 400g. Women&apos;s crewneck.
            </p>
          </div>

          <div className="mt-12">
            <WaitlistForm className="mx-auto max-w-sm" />
          </div>
        </div>
      </section>

      {/* Marquee */}
      <section className="overflow-hidden border-y border-neutral-100 py-5">
        <div className="flex animate-marquee whitespace-nowrap">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-12 px-6 text-[10px] font-medium uppercase tracking-[0.3em] text-muted-foreground/40"
            >
              <span>Grade A Mongolian Cashmere</span>
              <span>·</span>
              <span>Same Factories as Luxury Brands</span>
              <span>·</span>
              <span>No Label Tax</span>
              <span>·</span>
              <span>Direct From Makers</span>
              <span>·</span>
              <span>$89</span>
            </div>
          ))}
        </div>
      </section>

      {/* How */}
      <section className="bg-neutral-950 py-32 text-white sm:py-40">
        <div className="mx-auto max-w-5xl px-6 sm:px-10">
          <p className="mb-20 text-[10px] font-medium uppercase tracking-[0.35em] text-white/30">
            How it&apos;s possible
          </p>
          <div className="grid gap-20 md:grid-cols-3 md:gap-16">
            {[
              {
                title: "Same factories",
                body: "We source from the exact Mongolian mills that produce for luxury houses. Same yarn. Same hands. Different label.",
              },
              {
                title: "No middlemen",
                body: "Traditional retail marks up 5-8x. We go factory → you. That's how $55 becomes $89 instead of $349.",
              },
              {
                title: "One product first",
                body: "We're perfecting a single product before adding anything else. Fewer, better things. Less noise.",
              },
            ].map((item) => (
              <div key={item.title}>
                <h3 className="text-lg font-medium tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-white/40">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote / ethos */}
      <section className="py-32 sm:py-40">
        <div className="mx-auto max-w-2xl px-6 text-center sm:px-10">
          <blockquote className="text-[clamp(1.5rem,3vw,2.5rem)] font-medium leading-tight tracking-tight">
            &ldquo;Quality is the new status.&rdquo;
          </blockquote>
          <p className="mt-8 text-sm leading-relaxed text-muted-foreground">
            For those who would rather own one exceptional thing than ten
            disposable ones. For those who know the difference between a label
            and quality. For those who don&apos;t need a logo to know something is
            worth wearing.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-neutral-950 py-32 text-white sm:py-40">
        <div className="mx-auto max-w-xl px-6 text-center sm:px-10">
          <h2 className="text-[clamp(2rem,5vw,4rem)] font-medium leading-[0.92] tracking-tight">
            First drop.
            <br />
            <span className="text-white/30">Limited units.</span>
          </h2>
          <p className="mt-6 text-sm leading-relaxed text-white/40">
            500 units. When they&apos;re gone, they&apos;re gone. The waitlist gets
            first access.
          </p>
          <div className="mt-12">
            <WaitlistForm className="mx-auto max-w-sm" variant="dark" />
          </div>
        </div>
      </section>
    </div>
  );
}
