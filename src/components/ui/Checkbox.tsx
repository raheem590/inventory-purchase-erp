import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

export function Checkbox({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type="checkbox"
      className={cn("h-5 w-5 rounded border-slate-300 text-emerald-600", className)}
      {...props}
    />
  );
}
