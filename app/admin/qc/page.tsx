import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/helpers";

export const metadata = { title: "QC — Admin" };

export default async function AdminQCPage() {
  await requireAdmin();
  const supabase = createAdminClient();

  const { data: qcRecords } = await supabase
    .from("qc_records")
    .select(`
      id,
      order_id,
      factory_id,
      qc_type,
      status,
      inspector,
      notes,
      inspected_at,
      created_at,
      factories ( name )
    `)
    .order("created_at", { ascending: false });

  const statusColors: Record<string, string> = {
    pending: "text-amber-600",
    passed: "text-green-600",
    failed: "text-red-600",
    conditional: "text-blue-600",
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Quality Control</h1>
        <p className="mt-1 text-sm text-muted-foreground">Pre-shipment, post-delivery, and return inspections.</p>
      </div>

      {(!qcRecords || qcRecords.length === 0) ? (
        <Card>
          <CardHeader>
            <CardTitle>No QC records yet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">QC records will appear here once orders flow through the system.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {qcRecords.map((qc) => (
            <Card key={qc.id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">
                    {qc.qc_type} · {qc.factories?.name || "Unknown factory"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Order: {qc.order_id.slice(0, 8)}
                    {qc.inspector && ` · Inspector: ${qc.inspector}`}
                    {qc.notes && ` · ${qc.notes}`}
                  </p>
                </div>
                <span className={`text-xs font-medium ${statusColors[qc.status] || "text-muted-foreground"}`}>
                  {qc.status}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
