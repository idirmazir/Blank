import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto w-full max-w-6xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <p className="text-lg font-semibold tracking-[0.2em] uppercase">Blank</p>
            <p className="text-sm text-muted-foreground">
              Substance over status. Quality essentials, sourced directly from makers.
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium">Shop</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/shop" className="hover:text-foreground">All products</Link></li>
              <li><Link href="/shop?category=apparel" className="hover:text-foreground">Apparel</Link></li>
              <li><Link href="/shop?category=accessories" className="hover:text-foreground">Accessories</Link></li>
              <li><Link href="/shop?category=home" className="hover:text-foreground">Home</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium">Account</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/account/orders" className="hover:text-foreground">Orders</Link></li>
              <li><Link href="/account/login" className="hover:text-foreground">Sign in</Link></li>
              <li><Link href="/account/signup" className="hover:text-foreground">Create account</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium">Blank Collective</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Quality is the new status.</li>
              <li>Direct from manufacturers.</li>
              <li>No logos. No slogans. No status symbols.</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-6 flex flex-col items-center justify-between gap-2 text-xs text-muted-foreground sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Blank Collective. All rights reserved.</p>
          <p>Made in Perth, Australia.</p>
        </div>
      </div>
    </footer>
  );
}
