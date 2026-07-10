"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";

import { signOutAction } from "@/app/account/actions";
import { isAdmin } from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/client";

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
    return <div className="h-8 w-16" />;
  }

  if (!user) {
    return (
      <Link
        href="/account/login"
        className="link-underline px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        Sign in
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <Link
        href="/account/orders"
        className="link-underline px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        Orders
      </Link>
      {isAdmin(user) ? (
        <Link
          href="/admin"
          className="link-underline px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Admin
        </Link>
      ) : null}
      <form action={signOutAction}>
        <button
          type="submit"
          className="px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Sign out
        </button>
      </form>
    </div>
  );
}
