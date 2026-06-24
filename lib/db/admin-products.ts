import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/types/database";

export async function getAllProductsForAdmin() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data satisfies Product[];
}
