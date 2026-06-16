import { notFound } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { Card } from "@/components/ui/Card";
import { ProductForm } from "@/components/ProductForm";
import { getCategories } from "@/actions/categories";
import { getProduct } from "@/actions/products";
import { getUnits } from "@/actions/uom";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const [product, categories, units] = await Promise.all([
    getProduct(id),
    getCategories(true),
    getUnits(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-4 py-6">
      <AppHeader title="Edit Product" backHref="/admin/products" />
      <Card>
        <ProductForm
          product={product}
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
    </main>
  );
}
