import { LoginForm } from "@/components/LoginForm";
import { Card } from "@/components/ui/Card";
import { ShoppingCart } from "lucide-react";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-4 py-10">
      <div className="w-full">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-200">
            <ShoppingCart className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Inventory Purchase ERP</h1>
          <p className="mt-2 text-sm text-slate-600">Enter your 6-digit PIN to continue</p>
        </div>
        <Card accent="emerald">
          <LoginForm />
        </Card>
      </div>
    </main>
  );
}
