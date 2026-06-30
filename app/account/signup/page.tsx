import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { SignUpForm } from "@/components/account/signup-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Create account",
};

export default function SignUpPage() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 px-4 py-16">
      <Card>
        <CardHeader>
          <CardTitle>Create account</CardTitle>
          <CardDescription>
            Sign up to track orders and check out faster.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<p className="text-sm text-muted-foreground">Loading…</p>}>
            <SignUpForm />
          </Suspense>
        </CardContent>
      </Card>
      <div className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/account/login" className="text-foreground underline">
          Sign in
        </Link>
      </div>
      <Link href="/shop" className={buttonVariants({ variant: "ghost", size: "sm" })}>
        Continue shopping
      </Link>
    </div>
  );
}
