import { Skeleton } from "@/components/ui";

export function SectionHeadingSkeleton() {
  return (
    <div className="max-w-2xl">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="mt-2 h-8 w-64 max-w-full" />
      <Skeleton className="mt-3 h-4 w-72 max-w-full" />
    </div>
  );
}
