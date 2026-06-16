import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-4 py-10">
      <div className="w-full">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-slate-900">Inventory Purchase ERP</h1>
          <p className="mt-2 text-sm text-slate-600">Enter your 6-digit PIN to continue</p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
