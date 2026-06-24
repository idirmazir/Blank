import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getSessionUser } from "@/lib/auth/helpers";
import { isAdmin } from "@/lib/auth/roles";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  if (!user) {
    redirect("/account/login?next=/admin");
  }

  if (!isAdmin(user)) {
    redirect("/");
  }

  return <div className="min-h-[60vh]">{children}</div>;
}
