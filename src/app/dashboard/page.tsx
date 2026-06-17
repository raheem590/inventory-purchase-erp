import { AppHeader } from "@/components/AppHeader";
import { DashboardCards } from "@/components/DashboardCards";
import { Card } from "@/components/ui/Card";
import { LayoutDashboard } from "lucide-react";

export default function DashboardPage() {
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-6">
      <AppHeader title="Dashboard" showBack={false} />
      <Card accent="emerald" className="mb-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-200">
            <LayoutDashboard className="h-7 w-7 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Welcome back</h2>
            <p className="text-sm text-slate-600">
              Choose a module to create purchase lists or manage your inventory data.
            </p>
          </div>
        </div>
      </Card>
      <DashboardCards />
    </main>
  );
}
