"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function WaitlistForm({ className }: { className?: string }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

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
        body: JSON.stringify({ email, name: name || undefined, source: "landing" }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to join");
      }

      setStatus("success");
      setEmail("");
      setName("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className={cn("text-center", className)}>
        <p className="text-sm font-medium">You&apos;re on the list.</p>
        <p className="mt-1 text-xs text-muted-foreground">
          We&apos;ll be in touch when the first product drops.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn("w-full space-y-3", className)}>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={status === "loading"}
          className="flex-1"
        />
        <Button type="submit" disabled={status === "loading"} className="gap-2">
          {status === "loading" ? "Joining…" : "Join waitlist"}
          <ArrowRight className="size-4" />
        </Button>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </form>
  );
}
