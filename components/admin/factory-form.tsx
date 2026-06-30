"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function FactoryForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    contact_name: "",
    email: "",
    phone: "",
    wechat_id: "",
    country: "China",
    payment_method: "wise",
    // Wise payment details
    account_holder_name: "",
    account_number: "",
    swift_bic: "",
    bank_name: "",
    bank_address: "",
    cnaps_code: "",
    province: "",
    city: "",
    // QC requirements
    qc_inspection_required: true,
    qc_lead_time_days: 7,
    qc_moq: 1,
    notes: "",
  });

  function update<K extends keyof typeof form>(key: K, value: typeof form[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/factories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          contact_name: form.contact_name || null,
          email: form.email || null,
          phone: form.phone || null,
          wechat_id: form.wechat_id || null,
          country: form.country,
          payment_method: form.payment_method,
          payment_details: {
            account_holder_name: form.account_holder_name,
            account_number: form.account_number,
            swift_bic: form.swift_bic,
            bank_name: form.bank_name,
            bank_address: form.bank_address,
            cnaps_code: form.cnaps_code,
            province: form.province,
            city: form.city,
          },
          shipping_origin_address: {
            country: form.country,
            province: form.province,
            city: form.city,
          },
          qc_requirements: {
            inspection_required: form.qc_inspection_required,
            lead_time_days: form.qc_lead_time_days,
            moq: form.qc_moq,
          },
          notes: form.notes || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create factory");
      }

      router.push("/admin/factories");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Factory Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Factory Name *</Label>
            <Input id="name" required value={form.name} onChange={(e) => update("name", e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact_name">Contact Name</Label>
              <Input id="contact_name" value={form.contact_name} onChange={(e) => update("contact_name", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wechat_id">WeChat ID</Label>
              <Input id="wechat_id" value={form.wechat_id} onChange={(e) => update("wechat_id", e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Details (Wise)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="account_holder_name">Account Holder Name *</Label>
            <Input id="account_holder_name" required value={form.account_holder_name} onChange={(e) => update("account_holder_name", e.target.value)} />
            <p className="text-xs text-muted-foreground">Must match bank record exactly (Chinese + pinyin)</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="account_number">Account Number</Label>
              <Input id="account_number" value={form.account_number} onChange={(e) => update("account_number", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="swift_bic">SWIFT/BIC Code *</Label>
              <Input id="swift_bic" required value={form.swift_bic} onChange={(e) => update("swift_bic", e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bank_name">Bank Name *</Label>
              <Input id="bank_name" required value={form.bank_name} onChange={(e) => update("bank_name", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cnaps_code">CNAPS Code *</Label>
              <Input id="cnaps_code" required value={form.cnaps_code} onChange={(e) => update("cnaps_code", e.target.value)} />
              <p className="text-xs text-muted-foreground">12-digit China National Advanced Payment System code</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="province">Province *</Label>
              <Input id="province" required value={form.province} onChange={(e) => update("province", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input id="city" required value={form.city} onChange={(e) => update("city", e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>QC Requirements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="qc_lead_time_days">Lead Time (days)</Label>
              <Input id="qc_lead_time_days" type="number" value={form.qc_lead_time_days} onChange={(e) => update("qc_lead_time_days", parseInt(e.target.value) || 7)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="qc_moq">Minimum Order Qty</Label>
              <Input id="qc_moq" type="number" value={form.qc_moq} onChange={(e) => update("qc_moq", parseInt(e.target.value) || 1)} />
            </div>
          </div>
        </CardContent>
      </Card>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={loading} className={cn(buttonVariants(), "justify-center")}>
          {loading ? "Saving…" : "Create factory"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/factories")}
          className={buttonVariants({ variant: "outline" })}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
