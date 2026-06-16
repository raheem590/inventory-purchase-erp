import Link from "next/link";
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
    <header className="mb-6 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        {showBack ? (
          <Link
            href={backHref}
            className="text-sm font-medium text-emerald-700 hover:underline"
          >
            Back
          </Link>
        ) : null}
        <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
      </div>
      <form action="/api/auth/logout" method="post">
        <Button type="submit" variant="ghost">
          Logout
        </Button>
      </form>
    </header>
  );
}
