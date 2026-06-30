import { NextRequest, NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/helpers";

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("factories")
      .insert({
        name: body.name,
        contact_name: body.contact_name || null,
        email: body.email || null,
        phone: body.phone || null,
        wechat_id: body.wechat_id || null,
        country: body.country || "China",
        payment_method: body.payment_method || "wise",
        payment_details: body.payment_details || {},
        shipping_origin_address: body.shipping_origin_address || {},
        qc_requirements: body.qc_requirements || {},
        notes: body.notes || null,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Create factory error:", error);
    return NextResponse.json({ error: "Failed to create factory" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await requireAdmin();
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("factories")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Get factories error:", error);
    return NextResponse.json({ error: "Failed to fetch factories" }, { status: 500 });
  }
}
