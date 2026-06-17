import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { Card } from "@/components/ui/Card";
import { CategoryForm } from "@/components/CategoryForm";
import { getCategories } from "@/actions/categories";

export default async function CategoriesAdminPage() {
  const categories = await getCategories(true);

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-6">
      <AppHeader title="Manage Categories" />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card accent="violet">
          <h2 className="mb-4 text-lg font-bold text-slate-900">Add category</h2>
          <CategoryForm />
        </Card>

        <Card accent="violet">
          <h2 className="mb-4 text-lg font-bold text-slate-900">All categories</h2>
          <div className="space-y-3">
            {categories.length === 0 ? (
              <p className="text-sm text-slate-500">No categories yet.</p>
            ) : (
              categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between rounded-xl border border-violet-100 bg-violet-50/50 px-3 py-3 transition hover:bg-violet-50"
                >
                  <div>
                    <p className="font-semibold text-slate-900">{category.name}</p>
                    <p className="text-sm text-slate-500">
                      {category._count.products} products ·{" "}
                      {category.active ? "Active" : "Inactive"}
                    </p>
                  </div>
                  <Link
                    href={`/admin/categories/${category.id}`}
                    className="text-sm font-semibold text-violet-700 hover:underline"
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
