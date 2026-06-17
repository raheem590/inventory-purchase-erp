import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyPurchaseListButton } from "@/components/CopyPurchaseListButton";
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

  const copyLines = list.items.map(
    (item) =>
      `${item.product.name} ${Number(item.quantity).toString()} ${item.product.uom.abbreviation}`,
  );

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-6">
      <AppHeader title="Purchase List" backHref="/purchase/history" />

      <Card accent="emerald">
        <div className="mb-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-4 text-white">
          <h2 className="text-2xl font-bold">{list.category.name}</h2>
          <p className="mt-1 text-sm text-emerald-50">Date: {formatDate(list.listDate)}</p>
        </div>

        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-2 py-2 text-left text-sm font-semibold text-slate-700">Product</th>
              <th className="px-2 py-2 text-right text-sm font-semibold text-slate-700">
                Quantity
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {list.items.map((item) => (
              <tr key={item.id} className="hover:bg-emerald-50/50">
                <td className="px-2 py-2 text-sm font-medium text-slate-900">
                  {item.product.name}
                </td>
                <td className="px-2 py-2 text-right text-sm text-slate-700">
                  {Number(item.quantity).toString()}{" "}
                  <span className="font-semibold text-emerald-700">
                    {item.product.uom.abbreviation}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <div className="mt-6 flex gap-3">
        <CopyPurchaseListButton lines={copyLines} />
        <Link
          href="/purchase/new"
          className="inline-flex min-h-11 items-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          Create another list
        </Link>
      </div>
    </main>
  );
}
