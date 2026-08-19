import {
  cloneElement,
  isValidElement,
  type ButtonHTMLAttributes,
} from "react";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive"
  | "link";

export type ButtonSize = "sm" | "md" | "lg" | "icon";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-zinc-900 text-white hover:bg-zinc-700 focus-visible:ring-zinc-900 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 dark:focus-visible:ring-zinc-50",
  secondary:
    "bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:ring-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-400",
  outline:
    "border border-zinc-300 bg-transparent text-zinc-900 hover:bg-zinc-100 focus-visible:ring-zinc-300 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-800",
  ghost:
    "bg-transparent text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:ring-zinc-300 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50",
  destructive:
    "bg-red-600 text-white hover:bg-red-500 focus-visible:ring-red-600 dark:bg-red-700 dark:hover:bg-red-600",
  link: "bg-transparent text-indigo-600 underline-offset-4 hover:underline focus-visible:ring-indigo-600 dark:text-indigo-400",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
  icon: "h-10 w-10",
};

export function buttonVariants(options?: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}) {
  const { variant = "primary", size = "md", className } = options ?? {};
  return cn(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-[color,background-color,border-color,box-shadow,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] motion-reduce:transform-none dark:focus-visible:ring-offset-zinc-950",
    variantClasses[variant],
    sizeClasses[size],
    className,
  );
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  asChild?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled,
  className,
  children,
  asChild = false,
  ...props
}: ButtonProps) {
  const classes = buttonVariants({ variant, size, className });

  if (asChild) {
    const child = isValidElement(children) ? children : <span>{children}</span>;
    const isDisabled = disabled ?? isLoading;
    return cloneElement(child, {
      className: cn(classes, child.props.className),
      ...(isDisabled ? { disabled: true, "aria-disabled": true } : {}),
      ...props,
    } as Record<string, unknown>);
  }

  return (
    <button
      className={classes}
      disabled={disabled ?? isLoading}
      {...props}
    >
      {isLoading ? (
        <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden />
      ) : null}
      {children}
    </button>
  );
}
