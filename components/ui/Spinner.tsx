import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type SpinnerSize = "sm" | "md" | "lg";

const sizeClasses: Record<SpinnerSize, string> = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};

export function Spinner({
  size = "md",
  className,
}: {
  size?: SpinnerSize;
  className?: string;
}) {
  return (
    <LoaderCircle
      className={cn("animate-spin", sizeClasses[size], className)}
      aria-hidden
    />
  );
}

export function LoadingState({
  label = "Loading...",
}: {
  label?: string;
}) {
  return (
    <div
      role="status"
      className="flex flex-col items-center justify-center gap-3 py-16 text-zinc-500 dark:text-zinc-400"
    >
      <Spinner size="lg" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
