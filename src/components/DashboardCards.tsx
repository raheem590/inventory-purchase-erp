import Link from "next/link";
import {
  ClipboardList,
  FolderTree,
  History,
  Package,
  Ruler,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface DashboardLink {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  hoverBorder: string;
}

const links: DashboardLink[] = [
  {
    href: "/purchase/new",
    title: "Create Purchase List",
    description: "Select category, check items, and save by date",
    icon: ClipboardList,
    iconBg: "bg-gradient-to-br from-emerald-400 to-teal-500",
    iconColor: "text-white",
    hoverBorder: "hover:border-emerald-300",
  },
  {
    href: "/purchase/history",
    title: "Purchase History",
    description: "View saved purchase lists by date",
    icon: History,
    iconBg: "bg-gradient-to-br from-blue-400 to-indigo-500",
    iconColor: "text-white",
    hoverBorder: "hover:border-blue-300",
  },
  {
    href: "/admin/categories",
    title: "Manage Categories",
    description: "Add or edit purchase list categories",
    icon: FolderTree,
    iconBg: "bg-gradient-to-br from-violet-400 to-purple-500",
    iconColor: "text-white",
    hoverBorder: "hover:border-violet-300",
  },
  {
    href: "/admin/products",
    title: "Manage Products",
    description: "Add or edit products in each category",
    icon: Package,
    iconBg: "bg-gradient-to-br from-amber-400 to-orange-500",
    iconColor: "text-white",
    hoverBorder: "hover:border-amber-300",
  },
  {
    href: "/admin/uom",
    title: "Manage Units",
    description: "Add or edit units of measure for products",
    icon: Ruler,
    iconBg: "bg-gradient-to-br from-rose-400 to-pink-500",
    iconColor: "text-white",
    hoverBorder: "hover:border-rose-300",
  },
];

export function DashboardCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <Link key={link.href} href={link.href}>
            <Card
              className={cn(
                "h-full transition duration-200 hover:-translate-y-0.5 hover:shadow-xl",
                link.hoverBorder,
              )}
            >
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-md",
                    link.iconBg,
                  )}
                >
                  <Icon className={cn("h-6 w-6", link.iconColor)} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{link.title}</h2>
                  <p className="mt-1 text-sm text-slate-600">{link.description}</p>
                </div>
              </div>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
