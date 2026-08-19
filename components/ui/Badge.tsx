import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant =
  | "default"
  | "secondary"
  | "outline"
  | "success"
  | "warning"
  | "danger";

const variantClasses: Record<BadgeVariant, string> = {
  default:
    "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300",
  secondary:
    "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  outline:
    "border border-zinc-300 text-zinc-700 dark:border-zinc-700 dark:text-zinc-300",
  success:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  warning:
    "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  danger: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
};

export function badgeVariants(options?: {
  variant?: BadgeVariant;
  className?: string;
}) {
  const { variant = "default", className } = options ?? {};
  return cn(
    "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
    variantClasses[variant],
    className,
  );
}

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({ variant = "default", className, ...props }: BadgeProps) {
  return <span className={badgeVariants({ variant, className })} {...props} />;
}
