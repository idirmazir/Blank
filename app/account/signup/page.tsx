import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { SignUpForm } from "@/components/account/signup-form";

export const metadata: Metadata = {
  title: "Create account",
};

export default function SignUpPage() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-8 px-6 py-24 sm:px-10">
      <div>
        <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.35em] text-muted-foreground">
          Account
        </p>
        <h1 className="text-[clamp(1.5rem,3vw,2rem)] font-medium tracking-tight">Create account</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Sign up to track orders and check out faster.
        </p>
      </div>
      <Suspense fallback={<p className="text-sm text-muted-foreground">Loading…</p>}>
        <SignUpForm />
      </Suspense>
      <div className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/account/login" className="link-underline text-foreground">
          Sign in
        </Link>
      </div>
    </div>
  );
}
