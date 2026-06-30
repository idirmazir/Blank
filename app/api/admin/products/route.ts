import { NextRequest, NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/helpers";

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("products")
      .insert({
        name: body.name,
        slug: body.slug,
        description: body.description || "",
        price_cents: body.price_cents,
        currency: body.currency || "aud",
        category: body.category || "",
        image_urls: body.image_urls || [],
        stock: body.stock || 0,
        factory_id: body.factory_id || null,
        factory_cost_cents: body.factory_cost_cents || 0,
        lead_time_days: body.lead_time_days || 7,
        active: body.active ?? true,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await requireAdmin();
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Get products error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
