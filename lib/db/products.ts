import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/types/database";

export async function getActiveProducts(category?: string) {
  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: false });

  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data satisfies Product[];
}

export async function getFeaturedProducts(limit = 8) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  return data satisfies Product[];
}

export async function getProductBySlug(slug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getProductCategories() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select("category")
    .eq("active", true);

  if (error) {
    throw new Error(error.message);
  }

  return [...new Set(data.map((row) => row.category).filter(Boolean))].sort();
}
