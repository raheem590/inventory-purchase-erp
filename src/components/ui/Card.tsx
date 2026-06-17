import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  accent?: "emerald" | "blue" | "violet" | "amber" | "rose" | "none";
}

const accentStyles: Record<NonNullable<CardProps["accent"]>, string> = {
  emerald: "border-t-4 border-t-emerald-500",
  blue: "border-t-4 border-t-blue-500",
  violet: "border-t-4 border-t-violet-500",
  amber: "border-t-4 border-t-amber-500",
  rose: "border-t-4 border-t-rose-500",
  none: "",
};

export function Card({ className, accent = "none", ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/80 bg-white/90 p-5 shadow-lg shadow-slate-200/50 backdrop-blur-sm",
        accentStyles[accent],
        className,
      )}
      {...props}
    />
  );
}
