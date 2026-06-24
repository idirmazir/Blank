"use client";

import { useMemo, useState, useTransition } from "react";
import { Pencil, Plus } from "lucide-react";
import { toast } from "sonner";

import {
  saveProductAction,
  toggleProductActiveAction,
} from "@/app/admin/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatAud, formatCategory } from "@/lib/format";
import { slugify } from "@/lib/slugify";
import type { Product } from "@/types/database";

type ProductFormState = {
  id?: string;
  name: string;
  slug: string;
  description: string;
  price_cents: string;
  category: string;
  stock: string;
  image_urls: string;
  active: boolean;
};

const emptyForm: ProductFormState = {
  name: "",
  slug: "",
  description: "",
  price_cents: "0",
  category: "",
  stock: "0",
  image_urls: "",
  active: true,
};

function productToForm(product: Product): ProductFormState {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price_cents: String(product.price_cents),
    category: product.category,
    stock: String(product.stock),
    image_urls: product.image_urls.join("\n"),
    active: product.active,
  };
}

export function AdminProductsPanel({ products }: { products: Product[] }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<ProductFormState>(emptyForm);
  const [isPending, startTransition] = useTransition();

  const dialogTitle = useMemo(
    () => (form.id ? "Edit product" : "Add product"),
    [form.id],
  );

  function openCreateDialog() {
    setForm(emptyForm);
    setOpen(true);
  }

  function openEditDialog(product: Product) {
    setForm(productToForm(product));
    setOpen(true);
  }

  function updateField<K extends keyof ProductFormState>(
    key: K,
    value: ProductFormState[K],
  ) {
    setForm((current) => {
      const next = { ...current, [key]: value };
      if (key === "name" && !current.id && typeof value === "string") {
        next.slug = slugify(value);
      }
      return next;
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData();
    if (form.id) formData.set("id", form.id);
    formData.set("name", form.name);
    formData.set("slug", form.slug);
    formData.set("description", form.description);
    formData.set("price_cents", form.price_cents);
    formData.set("category", form.category);
    formData.set("stock", form.stock);
    formData.set("image_urls", form.image_urls);
    if (form.active) formData.set("active", "on");

    startTransition(async () => {
      const result = await saveProductAction(formData);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success(form.id ? "Product updated" : "Product created");
      setOpen(false);
      setForm(emptyForm);
    });
  }

  function handleToggleActive(product: Product) {
    startTransition(async () => {
      const result = await toggleProductActiveAction(
        product.id,
        !product.active,
        product.slug,
      );

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success(product.active ? "Product deactivated" : "Product activated");
    });
  }

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Products</h1>
          <p className="mt-2 text-muted-foreground">
            Manage catalog items shown in the shop.
          </p>
        </div>
        <Button type="button" onClick={openCreateDialog}>
          <Plus className="size-4" />
          Add product
        </Button>
      </div>

      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                  No products yet. Add your first item.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-xs text-muted-foreground">{product.slug}</div>
                  </TableCell>
                  <TableCell>{formatCategory(product.category)}</TableCell>
                  <TableCell>{formatAud(product.price_cents)}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <Badge variant={product.active ? "default" : "secondary"}>
                      {product.active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(product)}
                      >
                        <Pencil className="size-3.5" />
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={isPending}
                        onClick={() => handleToggleActive(product)}
                      >
                        {product.active ? "Deactivate" : "Activate"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription>
              Prices are stored in cents. Image URLs can be one per line.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  required
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  required
                  value={form.slug}
                  onChange={(event) => updateField("slug", event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  required
                  value={form.category}
                  onChange={(event) => updateField("category", event.target.value)}
                  placeholder="apparel"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price_cents">Price (cents)</Label>
                <Input
                  id="price_cents"
                  type="number"
                  min="0"
                  required
                  value={form.price_cents}
                  onChange={(event) => updateField("price_cents", event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  required
                  value={form.stock}
                  onChange={(event) => updateField("stock", event.target.value)}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  rows={3}
                  className="flex min-h-20 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  value={form.description}
                  onChange={(event) => updateField("description", event.target.value)}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="image_urls">Image URLs</Label>
                <textarea
                  id="image_urls"
                  rows={3}
                  className="flex min-h-20 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  value={form.image_urls}
                  onChange={(event) => updateField("image_urls", event.target.value)}
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
              <label className="flex items-center gap-2 sm:col-span-2">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(event) => updateField("active", event.target.checked)}
                />
                <span className="text-sm">Active in shop</span>
              </label>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving…" : "Save product"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
