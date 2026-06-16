import { notFound } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { Card } from "@/components/ui/Card";
import { CategoryForm } from "@/components/CategoryForm";
import { getCategory } from "@/actions/categories";

interface EditCategoryPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const { id } = await params;
  const category = await getCategory(id);

  if (!category) {
    notFound();
  }

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-4 py-6">
      <AppHeader title="Edit Category" backHref="/admin/categories" />
      <Card>
        <CategoryForm category={category} />
      </Card>
    </main>
  );
}
