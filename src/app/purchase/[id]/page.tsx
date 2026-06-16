import Link from "next/link";
import { notFound } from "next/navigation";
import { PrintButton } from "@/components/PrintButton";
import { AppHeader } from "@/components/AppHeader";
import { Card } from "@/components/ui/Card";
import { getPurchaseList } from "@/actions/purchase-lists";
import { formatDate } from "@/lib/utils";

interface PurchaseDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function PurchaseDetailPage({ params }: PurchaseDetailPageProps) {
  const { id } = await params;
  const list = await getPurchaseList(id);

  if (!list) {
    notFound();
  }

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-6">
      <div className="no-print">
        <AppHeader title="Purchase List" backHref="/purchase/history" />
      </div>

      <Card className="print-container">
        <div className="mb-6 border-b border-slate-200 pb-4">
          <h2 className="text-2xl font-bold text-slate-900">{list.category.name}</h2>
          <p className="mt-1 text-sm text-slate-600">Date: {formatDate(list.listDate)}</p>
        </div>

        <table className="min-w-full divide-y divide-slate-200">
          <thead>
            <tr>
              <th className="px-2 py-2 text-left text-sm font-semibold text-slate-700">
                Product
              </th>
              <th className="px-2 py-2 text-right text-sm font-semibold text-slate-700">
                Quantity
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {list.items.map((item) => (
              <tr key={item.id}>
                <td className="px-2 py-2 text-sm text-slate-900">{item.product.name}</td>
                <td className="px-2 py-2 text-right text-sm text-slate-700">
                  {Number(item.quantity).toString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <div className="no-print mt-6 flex gap-3">
        <PrintButton />
        <Link
          href="/purchase/new"
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Create another list
        </Link>
      </div>
    </main>
  );
}
