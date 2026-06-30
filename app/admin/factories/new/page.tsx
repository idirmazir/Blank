import { FactoryForm } from "@/components/admin/factory-form";

export const metadata = { title: "Add Factory — Admin" };

export default function NewFactoryPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight mb-6">Add Factory</h1>
      <FactoryForm />
    </div>
  );
}
