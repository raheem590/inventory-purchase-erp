import { AppHeader } from "@/components/AppHeader";
import { PurchaseListForm } from "@/components/PurchaseListForm";
import { getCategories } from "@/actions/categories";
import { getProducts } from "@/actions/products";
import { getUnits } from "@/actions/uom";
import { ClipboardList } from "lucide-react";

export default async function NewPurchaseListPage() {
  const [categories, products, units] = await Promise.all([
    getCategories(),
    getProducts(),
    getUnits(),
  ]);

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-6">
      <AppHeader title="Create Purchase List" />
      <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/80 px-4 py-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500">
          <ClipboardList className="h-5 w-5 text-white" />
        </div>
        <p className="text-sm text-emerald-900">
          Select a category, search products, check items, and enter quantities.
        </p>
      </div>
      <PurchaseListForm
        categories={categories.map((category) => ({
          id: category.id,
          name: category.name,
        }))}
        products={products.map((product) => ({
          id: product.id,
          name: product.name,
          displayName: `${product.name} (${product.uom.abbreviation})`,
          categoryId: product.categoryId,
        }))}
        units={units.map((unit) => ({
          id: unit.id,
          name: unit.name,
          abbreviation: unit.abbreviation,
        }))}
      />
    </main>
  );
}
