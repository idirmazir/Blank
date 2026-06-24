import type { User } from "@supabase/supabase-js";

export function isAdmin(user: User | null | undefined) {
  return user?.app_metadata?.role === "admin";
}
