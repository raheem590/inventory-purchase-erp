import Link from "next/link";
import { ArrowLeft, LogOut } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface AppHeaderProps {
  title: string;
  backHref?: string;
  showBack?: boolean;
}

export function AppHeader({
  title,
  backHref = "/dashboard",
  showBack = true,
}: AppHeaderProps) {
  return (
    <header className="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-white/80 bg-white/80 px-4 py-3 shadow-md shadow-slate-200/50 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        {showBack ? (
          <Link
            href={backHref}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        ) : null}
        <h1 className="text-xl font-bold text-slate-900">{title}</h1>
      </div>
      <form action="/api/auth/logout" method="post">
        <Button type="submit" variant="ghost" className="gap-2">
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </form>
    </header>
  );
}
