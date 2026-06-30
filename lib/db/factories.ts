import { createAdminClient } from "@/lib/supabase/admin";
import type { Factory } from "@/types/database";

export async function getFactories() {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("factories")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Factory[];
}

export async function getFactory(id: string) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("factories")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Factory;
}

export async function createFactory(input: Omit<Factory, "id" | "created_at">) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("factories")
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return data as Factory;
}

export async function updateFactory(id: string, input: Partial<Factory>) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("factories")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Factory;
}

export async function deactivateFactory(id: string) {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("factories")
    .update({ active: false })
    .eq("id", id);

  if (error) throw error;
}
