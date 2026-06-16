import { notFound } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { Card } from "@/components/ui/Card";
import { UomForm } from "@/components/UomForm";
import { getUnit } from "@/actions/uom";

interface EditUomPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditUomPage({ params }: EditUomPageProps) {
  const { id } = await params;
  const unit = await getUnit(id);

  if (!unit) {
    notFound();
  }

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-4 py-6">
      <AppHeader title="Edit Unit" backHref="/admin/uom" />
      <Card>
        <UomForm unit={unit} />
      </Card>
    </main>
  );
}
