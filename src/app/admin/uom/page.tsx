import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { Card } from "@/components/ui/Card";
import { UomForm } from "@/components/UomForm";
import { getUnits } from "@/actions/uom";

export default async function UomAdminPage() {
  const units = await getUnits(true);

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-6">
      <AppHeader title="Manage Units" />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Add unit</h2>
          <UomForm />
        </Card>

        <Card>
          <h2 className="mb-4 text-lg font-semibold text-slate-900">All units</h2>
          <div className="space-y-3">
            {units.length === 0 ? (
              <p className="text-sm text-slate-500">No units found.</p>
            ) : (
              units.map((unit) => (
                <div
                  key={unit.id}
                  className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-3"
                >
                  <div>
                    <p className="font-medium text-slate-900">{unit.name}</p>
                    <p className="text-sm text-slate-500">
                      {unit.abbreviation} · {unit.active ? "Active" : "Inactive"}
                    </p>
                  </div>
                  <Link
                    href={`/admin/uom/${unit.id}`}
                    className="text-sm font-medium text-emerald-700 hover:underline"
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
