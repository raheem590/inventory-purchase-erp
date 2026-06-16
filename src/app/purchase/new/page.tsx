import { AppHeader } from "@/components/AppHeader";
import { PurchaseListForm } from "@/components/PurchaseListForm";
import { getCategories } from "@/actions/categories";
import { getProducts } from "@/actions/products";

export default async function NewPurchaseListPage() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-6">
      <AppHeader title="Create Purchase List" />
      <PurchaseListForm
        categories={categories.map((category) => ({
          id: category.id,
          name: category.name,
        }))}
        products={products.map((product) => ({
          id: product.id,
          name: product.name,
          categoryId: product.categoryId,
        }))}
      />
    </main>
  );
}
