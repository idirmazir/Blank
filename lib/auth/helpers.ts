import type { User } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";

import { isAdmin } from "./roles";

export { isAdmin };

export async function getSessionUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }

  return user;
}

export async function requireUser() {
  const user = await getSessionUser();

  if (!user) {
    throw new Error("Authentication required");
  }

  return user;
}

export async function requireAdmin() {
  const user = await requireUser();

  if (!isAdmin(user)) {
    throw new Error("Admin access required");
  }

  return user;
}
