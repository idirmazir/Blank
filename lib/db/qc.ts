import { createAdminClient } from "@/lib/supabase/admin";

/**
 * QC records management.
 */

export async function createQCRecord(
  orderId: string,
  factoryId: string,
  qcType: "pre_ship" | "post_delivery" | "return_inspection",
  checklist: Record<string, boolean>,
  notes?: string,
  inspector?: string,
): Promise<string> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("qc_records")
    .insert({
      order_id: orderId,
      factory_id: factoryId,
      qc_type: qcType,
      status: "pending",
      checklist,
      notes: notes || null,
      inspector: inspector || null,
    })
    .select("id")
    .single();

  if (error) throw error;
  return data.id;
}

export async function updateQCStatus(
  recordId: string,
  status: "passed" | "failed" | "conditional",
  notes?: string,
  photos?: string[],
): Promise<void> {
  const supabase = createAdminClient();

  await supabase
    .from("qc_records")
    .update({
      status,
      notes: notes || null,
      photos: photos || [],
      inspected_at: new Date().toISOString(),
    })
    .eq("id", recordId);
}

export async function getQCForOrder(orderId: string) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("qc_records")
    .select("*")
    .eq("order_id", orderId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}
