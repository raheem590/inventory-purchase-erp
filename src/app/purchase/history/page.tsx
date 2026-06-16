import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { Card } from "@/components/ui/Card";
import { getPurchaseListsByDate } from "@/actions/purchase-lists";
import { addDays, formatDate, parseDateInput, toDateInputValue } from "@/lib/utils";

interface HistoryPageProps {
  searchParams: Promise<{ date?: string }>;
}

export default async function PurchaseHistoryPage({ searchParams }: HistoryPageProps) {
  const params = await searchParams;
  const dateStr = params.date ?? toDateInputValue();
  const lists = await getPurchaseListsByDate(dateStr);
  const currentDate = parseDateInput(dateStr);
  const prevDate = toDateInputValue(addDays(currentDate, -1));
  const nextDate = toDateInputValue(addDays(currentDate, 1));

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-6">
      <AppHeader title="Purchase History" />
      <Card className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-slate-600">Showing lists for</p>
            <p className="text-lg font-semibold text-slate-900">{formatDate(currentDate)}</p>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/purchase/history?date=${prevDate}`}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Previous day
            </Link>
            <Link
              href={`/purchase/history?date=${nextDate}`}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Next day
            </Link>
          </div>
        </div>
      </Card>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                Category
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                Items
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {lists.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-sm text-slate-500">
                  No purchase lists saved for this date.
                </td>
              </tr>
            ) : (
              lists.map((list) => (
                <tr key={list.id}>
                  <td className="px-4 py-3 text-sm text-slate-900">{list.category.name}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{list._count.items}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/purchase/${list.id}`}
                      className="text-sm font-medium text-emerald-700 hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
