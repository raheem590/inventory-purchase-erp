import Link from "next/link";
import { Card } from "@/components/ui/Card";

const links = [
  {
    href: "/purchase/new",
    title: "Create Purchase List",
    description: "Select category, check items, and save by date",
  },
  {
    href: "/purchase/history",
    title: "Purchase History",
    description: "View saved purchase lists by date",
  },
  {
    href: "/admin/categories",
    title: "Manage Categories",
    description: "Add or edit purchase list categories",
  },
  {
    href: "/admin/products",
    title: "Manage Products",
    description: "Add or edit products in each category",
  },
];

export function DashboardCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {links.map((link) => (
        <Link key={link.href} href={link.href}>
          <Card className="h-full transition hover:border-emerald-300 hover:shadow-md">
            <h2 className="text-lg font-semibold text-slate-900">{link.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{link.description}</p>
          </Card>
        </Link>
      ))}
    </div>
  );
}
