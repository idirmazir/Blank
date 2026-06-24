"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";

import { signOutAction } from "@/app/account/actions";
import { buttonVariants } from "@/components/ui/button";
import { isAdmin } from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export function HeaderAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="h-8 w-20 animate-pulse rounded-lg bg-muted" />;
  }

  if (!user) {
    return (
      <Link
        href="/account/login"
        className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
      >
        Sign in
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <Link
        href="/account/orders"
        className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
      >
        Orders
      </Link>
      {isAdmin(user) ? (
        <Link
          href="/admin"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
        >
          Admin
        </Link>
      ) : null}
      <form action={signOutAction}>
        <button
          type="submit"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          Sign out
        </button>
      </form>
    </div>
  );
}
