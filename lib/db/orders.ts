import { createClient } from "@/lib/supabase/server";
import type { Order, OrderItem, Product } from "@/types/database";

export type OrderWithItems = Order & {
  order_items: (OrderItem & { products: Pick<Product, "name" | "slug"> | null })[];
};

export async function getOrdersForUser(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("orders")
    .select(
      `
        *,
        order_items (
          *,
          products ( name, slug )
        )
      `,
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data as OrderWithItems[];
}

export async function getOrderByStripeSessionId(sessionId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("orders")
    .select(
      `
        *,
        order_items (
          *,
          products ( name, slug, image_urls )
        )
      `,
    )
    .eq("stripe_session_id", sessionId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
