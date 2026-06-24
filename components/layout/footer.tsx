import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>&copy; {new Date().getFullYear()} Blank</p>
        <div className="flex flex-wrap gap-4">
          <Link href="/shop" className="hover:text-foreground">
            Shop
          </Link>
          <Link href="/account/orders" className="hover:text-foreground">
            Orders
          </Link>
          <Link href="/account/login" className="hover:text-foreground">
            Sign in
          </Link>
        </div>
      </div>
    </footer>
  );
}
