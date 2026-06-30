import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border/40">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.2em]">Blank</p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Substance over status. Quality essentials, sourced directly from makers.
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">Shop</p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/shop" className="text-foreground/80 hover:text-foreground">All products</Link></li>
              <li><Link href="/shop?category=apparel" className="text-foreground/80 hover:text-foreground">Apparel</Link></li>
              <li><Link href="/shop?category=accessories" className="text-foreground/80 hover:text-foreground">Accessories</Link></li>
              <li><Link href="/shop?category=home" className="text-foreground/80 hover:text-foreground">Home</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">Account</p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/account/orders" className="text-foreground/80 hover:text-foreground">Orders</Link></li>
              <li><Link href="/account/login" className="text-foreground/80 hover:text-foreground">Sign in</Link></li>
              <li><Link href="/account/signup" className="text-foreground/80 hover:text-foreground">Create account</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">Philosophy</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Quality is the new status.</li>
              <li>Direct from manufacturers.</li>
              <li>No logos. No slogans.</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-2 border-t border-border/40 pt-8 text-xs text-muted-foreground sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Blank Collective.</p>
          <p>Perth, Australia.</p>
        </div>
      </div>
    </footer>
  );
}
