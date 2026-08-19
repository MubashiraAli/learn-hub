import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  titleLevel?: 1 | 2 | 3;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  titleLevel = 3,
}: EmptyStateProps) {
  const TitleTag = `h${titleLevel}` as ElementType;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-300 bg-zinc-50/50 px-6 py-16 text-center animate-fade-in-up motion-reduce:animate-none dark:border-zinc-700 dark:bg-zinc-900/50",
        className,
      )}
    >
      {icon ? (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
          {icon}
        </div>
      ) : null}
      <TitleTag className="mt-2 text-base font-semibold text-zinc-900 dark:text-zinc-50">
        {title}
      </TitleTag>
      {description ? (
        <p className="max-w-sm text-sm leading-6 text-zinc-500 dark:text-zinc-400">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
