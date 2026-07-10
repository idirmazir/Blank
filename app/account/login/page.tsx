import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { LoginForm } from "@/components/account/login-form";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function LoginPage() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-8 px-6 py-24 sm:px-10">
      <div>
        <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.35em] text-muted-foreground">
          Account
        </p>
        <h1 className="text-[clamp(1.5rem,3vw,2rem)] font-medium tracking-tight">Sign in</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Track orders and manage your account.
        </p>
      </div>
      <Suspense fallback={<p className="text-sm text-muted-foreground">Loading…</p>}>
        <LoginForm />
      </Suspense>
      <div className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/account/signup" className="link-underline text-foreground">
          Create one
        </Link>
      </div>
    </div>
  );
}
