import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  indicatorClassName?: string;
}

export function Progress({
  value,
  className,
  indicatorClassName,
  ...props
}: ProgressProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped)}
      className={cn(
        "h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "h-full rounded-full bg-indigo-600 transition-[width] duration-500 ease-out motion-reduce:transition-none dark:bg-indigo-400",
          indicatorClassName,
        )}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
