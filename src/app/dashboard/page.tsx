import { AppHeader } from "@/components/AppHeader";
import { DashboardCards } from "@/components/DashboardCards";

export default function DashboardPage() {
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-6">
      <AppHeader title="Dashboard" showBack={false} />
      <p className="mb-6 text-sm text-slate-600">
        Choose a module to create purchase lists or manage categories and products.
      </p>
      <DashboardCards />
    </main>
  );
}
