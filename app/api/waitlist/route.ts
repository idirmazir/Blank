import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, source, referred_by } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    const supabase = await createClient();
    const normalizedEmail = email.toLowerCase().trim();

    // Check if already on waitlist
    const { data: existing } = await supabase
      .from("waitlist")
      .select("referral_code")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (existing?.referral_code) {
      return NextResponse.json({
        success: true,
        referral_code: existing.referral_code,
      });
    }

    // Insert new waitlist entry (trigger generates referral_code)
    const { data: inserted, error } = await supabase
      .from("waitlist")
      .insert({
        email: normalizedEmail,
        source: source || "landing",
        referred_by: referred_by || null,
      })
      .select("referral_code")
      .single();

    if (error) {
      console.error("Waitlist insert error:", error);
      return NextResponse.json({ error: "Failed to join waitlist" }, { status: 500 });
    }

    // If referred, increment the referrer's count
    if (referred_by) {
      await supabase.rpc("increment_referral_count", {
        ref_code: referred_by,
      });
    }

    return NextResponse.json({
      success: true,
      referral_code: inserted.referral_code,
    });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
