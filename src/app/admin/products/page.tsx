import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { Card } from "@/components/ui/Card";
import { ProductForm } from "@/components/ProductForm";
import { getCategories } from "@/actions/categories";
import { getProducts } from "@/actions/products";
import { getUnits } from "@/actions/uom";
import { cn } from "@/lib/utils";

interface ProductsAdminPageProps {
  searchParams: Promise<{ categoryId?: string }>;
}

export default async function ProductsAdminPage({
  searchParams,
}: ProductsAdminPageProps) {
  const params = await searchParams;
  const [categories, products, units] = await Promise.all([
    getCategories(true),
    getProducts(params.categoryId, true),
    getUnits(),
  ]);

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-6">
      <AppHeader title="Manage Products" />
      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href="/admin/products"
          className={cn(
            "rounded-xl px-3 py-2 text-sm font-semibold transition",
            !params.categoryId
              ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md"
              : "border border-slate-200 bg-white text-slate-700 hover:bg-amber-50",
          )}
        >
          All
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/admin/products?categoryId=${category.id}`}
            className={cn(
              "rounded-xl px-3 py-2 text-sm font-semibold transition",
              params.categoryId === category.id
                ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md"
                : "border border-slate-200 bg-white text-slate-700 hover:bg-amber-50",
            )}
          >
            {category.name}
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card accent="amber">
          <h2 className="mb-4 text-lg font-bold text-slate-900">Add product</h2>
          <ProductForm
            categories={categories.map((category) => ({
              id: category.id,
              name: category.name,
            }))}
            units={units.map((unit) => ({
              id: unit.id,
              name: unit.name,
              abbreviation: unit.abbreviation,
            }))}
          />
        </Card>

        <Card accent="amber">
          <h2 className="mb-4 text-lg font-bold text-slate-900">Products</h2>
          <div className="space-y-3">
            {products.length === 0 ? (
              <p className="text-sm text-slate-500">No products found.</p>
            ) : (
              products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between rounded-xl border border-amber-100 bg-amber-50/50 px-3 py-3 transition hover:bg-amber-50"
                >
                  <div>
                    <p className="font-semibold text-slate-900">{product.name}</p>
                    <p className="text-sm text-slate-500">
                      {product.category.name} · {product.uom.abbreviation} ·{" "}
                      {product.active ? "Active" : "Inactive"}
                    </p>
                  </div>
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="text-sm font-semibold text-amber-700 hover:underline"
                  >
                    Edit
                  </Link>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </main>
  );
}
