import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export function Input({
  className,
  leftIcon,
  rightIcon,
  type = "text",
  ...props
}: InputProps) {
  return (
    <div className="relative">
      {leftIcon ? (
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
          {leftIcon}
        </span>
      ) : null}
      <input
        type={type}
        className={cn(
          "h-10 w-full rounded-lg border border-zinc-300 bg-transparent px-3 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-50",
          leftIcon && "pl-9",
          rightIcon && "pr-9",
          className,
        )}
        {...props}
      />
      {rightIcon ? (
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">
          {rightIcon}
        </span>
      ) : null}
    </div>
  );
}
