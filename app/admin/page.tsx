import { AdminProductsPanel } from "@/components/admin/admin-products-panel";
import { getAllProductsForAdmin } from "@/lib/db/admin-products";

export default async function AdminPage() {
  const products = await getAllProductsForAdmin();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <AdminProductsPanel products={products} />
    </div>
  );
}
