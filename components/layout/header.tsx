"use client";

import Link from "next/link";

import { CartDrawer } from "@/components/cart/cart-drawer";
import { HeaderAuth } from "@/components/layout/header-auth";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/cart", label: "Cart" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-10">
          <Link href="/" className="text-lg font-semibold tracking-[0.2em] uppercase">
            Blank
          </Link>
          <nav className="hidden items-center gap-6 text-sm sm:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <HeaderAuth />
          <CartDrawer />
        </div>
      </div>

      {/* Mobile nav */}
      <nav className="flex items-center gap-6 px-4 pb-2 text-sm sm:hidden">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
