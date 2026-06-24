"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth/helpers";
import { slugify } from "@/lib/slugify";
import { createClient } from "@/lib/supabase/server";

const productSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string(),
  price_cents: z.coerce.number().int().min(0),
  category: z.string().min(1, "Category is required"),
  stock: z.coerce.number().int().min(0),
  image_urls: z.string(),
  active: z.coerce.boolean(),
});

function parseImageUrls(raw: string) {
  return raw
    .split(/[\n,]/)
    .map((value) => value.trim())
    .filter(Boolean);
}

function revalidateCatalog(slug?: string) {
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin");
  if (slug) {
    revalidatePath(`/product/${slug}`);
  }
}

export async function saveProductAction(formData: FormData) {
  await requireAdmin();

  const parsed = productSchema.safeParse({
    id: formData.get("id") || undefined,
    name: formData.get("name"),
    slug: formData.get("slug") || slugify(String(formData.get("name") || "")),
    description: formData.get("description") || "",
    price_cents: formData.get("price_cents"),
    category: formData.get("category"),
    stock: formData.get("stock"),
    image_urls: formData.get("image_urls") || "",
    active: formData.get("active") === "on",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid product data" };
  }

  const payload = {
    name: parsed.data.name,
    slug: parsed.data.slug,
    description: parsed.data.description,
    price_cents: parsed.data.price_cents,
    category: parsed.data.category,
    stock: parsed.data.stock,
    image_urls: parseImageUrls(parsed.data.image_urls),
    active: parsed.data.active,
    currency: "aud" as const,
  };

  const supabase = await createClient();

  if (parsed.data.id) {
    const { error } = await supabase
      .from("products")
      .update(payload)
      .eq("id", parsed.data.id);

    if (error) {
      return { error: error.message };
    }
  } else {
    const { error } = await supabase.from("products").insert(payload);

    if (error) {
      return { error: error.message };
    }
  }

  revalidateCatalog(payload.slug);
  return { success: true as const };
}

export async function toggleProductActiveAction(
  productId: string,
  active: boolean,
  slug?: string,
) {
  await requireAdmin();

  const supabase = await createClient();
  const { error } = await supabase
    .from("products")
    .update({ active })
    .eq("id", productId);

  if (error) {
    return { error: error.message };
  }

  revalidateCatalog(slug);
  return { success: true as const };
}
