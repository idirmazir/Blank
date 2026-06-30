import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getFactories } from "@/lib/db/factories";

export const metadata = { title: "Factories — Admin" };

export default async function FactoriesPage() {
  const factories = await getFactories();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Factories</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage suppliers and payment details.</p>
        </div>
        <Link href="/admin/factories/new" className={buttonVariants()}>
          Add factory
        </Link>
      </div>

      {factories.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No factories yet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Add a factory once you&apos;ve established a relationship with a manufacturer.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {factories.map((factory) => (
            <Link key={factory.id} href={`/admin/factories/${factory.id}`}>
              <Card className="p-4 hover:bg-accent transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{factory.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {factory.contact_name || "No contact"} · {factory.country}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {factory.payment_method}
                    </p>
                    <span className={`text-xs ${factory.active ? "text-green-600" : "text-red-600"}`}>
                      {factory.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
