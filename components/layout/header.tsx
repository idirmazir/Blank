"use client";

import Link from "next/link";

import { CartDrawer } from "@/components/cart/cart-drawer";
import { HeaderAuth } from "@/components/layout/header-auth";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-base font-semibold tracking-tight">
            Blank
          </Link>
          <nav className="hidden items-center gap-6 text-sm sm:flex">
            <Link href="/" className="text-muted-foreground transition-colors hover:text-foreground">
              Home
            </Link>
            <Link href="/shop" className="text-muted-foreground transition-colors hover:text-foreground">
              Shop
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <HeaderAuth />
          <CartDrawer />
        </div>
      </div>

      {/* Mobile nav */}
      <nav className="flex items-center gap-6 px-4 pb-2 text-sm sm:hidden">
        <Link href="/" className="text-muted-foreground transition-colors hover:text-foreground">
          Home
        </Link>
        <Link href="/shop" className="text-muted-foreground transition-colors hover:text-foreground">
          Shop
        </Link>
        <Link href="/cart" className="text-muted-foreground transition-colors hover:text-foreground">
          Cart
        </Link>
      </nav>
    </header>
  );
}
