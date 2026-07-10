"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { ArrowRight, Check, Copy, Share2 } from "lucide-react";

import { cn } from "@/lib/utils";

function WaitlistFormInner({
  className,
  variant = "light",
}: {
  className?: string;
  variant?: "light" | "dark";
}) {
  const searchParams = useSearchParams();
  const refCode = searchParams.get("ref");

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [error, setError] = useState<string | null>(null);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const isDark = variant === "dark";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) {
      setError("Enter a valid email");
      return;
    }

    setStatus("loading");
    setError(null);

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source: "landing",
          referred_by: refCode || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to join");
      }

      const data = await res.json();
      setReferralCode(data.referral_code);
      setStatus("success");
      setEmail("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong",
      );
      setStatus("error");
    }
  }

  function copyReferralLink() {
    const link = `${window.location.origin}?ref=${referralCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (status === "success") {
    return (
      <div
        className={cn(
          "text-center animate-fade-in",
          isDark && "text-white",
          className,
        )}
      >
        <div
          className={cn(
            "mx-auto mb-4 flex size-10 items-center justify-center rounded-full",
            isDark ? "bg-white/10" : "bg-neutral-100",
          )}
        >
          <Check className="size-5" />
        </div>
        <p className="text-sm font-medium">You&apos;re on the list.</p>

        {referralCode && (
          <div className="mt-6 space-y-3">
            <p className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">
                Refer 10 friends
              </span>{" "}
              → free sweater at launch. Refer 3 → early access.
            </p>
            <button
              onClick={copyReferralLink}
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2 text-xs font-medium transition-all",
                isDark
                  ? "bg-white text-black hover:bg-white/90"
                  : "bg-neutral-950 text-white hover:bg-neutral-800",
              )}
            >
              {copied ? (
                <>
                  <Check className="size-3.5" />
                  Copied
                </>
              ) : (
                <>
                  <Share2 className="size-3.5" />
                  Copy your referral link
                </>
              )}
            </button>
          </div>
        )}
      </div>
    );
  }

  const inputClasses = cn(
    "flex-1 bg-transparent px-4 py-3 text-sm outline-none transition-all placeholder:text-muted-foreground/50 disabled:opacity-50",
    isDark
      ? "border-b border-white/20 focus:border-white text-white placeholder:text-white/30"
      : "border-b border-neutral-200 focus:border-neutral-900",
    "sm:border sm:border-r-0 sm:py-3.5",
    isDark && "sm:border-white/20 sm:focus:border-white",
  );

  const buttonClasses = cn(
    "group flex items-center justify-center gap-2 px-6 py-3 text-xs font-medium uppercase tracking-[0.15em] transition-all disabled:opacity-50 sm:py-3.5",
    isDark
      ? "bg-white text-black hover:bg-white/90"
      : "bg-neutral-950 text-white hover:bg-neutral-800",
  );

  return (
    <form onSubmit={handleSubmit} className={cn("w-full", className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-0">
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={status === "loading"}
          className={inputClasses}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className={buttonClasses}
        >
          {status === "loading" ? "Joining…" : "Get early access"}
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
      {error && (
        <p
          className={cn(
            "mt-3 text-xs",
            isDark ? "text-red-400" : "text-destructive",
          )}
        >
          {error}
        </p>
      )}
      {refCode && (
        <p
          className={cn(
            "mt-3 text-xs",
            isDark ? "text-white/30" : "text-muted-foreground",
          )}
        >
          You were referred by a friend — your spot&apos;s been bumped up.
        </p>
      )}
    </form>
  );
}

export function WaitlistForm({
  className,
  variant = "light",
}: {
  className?: string;
  variant?: "light" | "dark";
}) {
  return (
    <Suspense
      fallback={
        <div className={cn("w-full", className)}>
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-0">
            <div className="flex-1 px-4 py-3 sm:border sm:border-r-0 sm:py-3.5">
              <div className="h-5 w-full animate-pulse rounded bg-neutral-100" />
            </div>
            <div className="px-6 py-3 sm:py-3.5">
              <div className="h-5 w-16 animate-pulse rounded bg-neutral-200" />
            </div>
          </div>
        </div>
      }
    >
      <WaitlistFormInner className={className} variant={variant} />
    </Suspense>
  );
}
