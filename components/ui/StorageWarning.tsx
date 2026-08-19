import { TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

interface StorageWarningProps {
  label: string;
  className?: string;
}

export function StorageWarning({ label, className }: StorageWarningProps) {
  return (
    <p
      role="status"
      className={cn(
        "flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2.5 text-sm leading-6 text-amber-800 dark:border-amber-700 dark:bg-amber-950/50 dark:text-amber-200",
        className,
      )}
    >
      <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      <span>
        {label} Your browser is blocking local storage, so changes won&apos;t be
        saved between visits.
      </span>
    </p>
  );
}
