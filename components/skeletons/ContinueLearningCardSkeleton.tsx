import { Card, Skeleton } from "@/components/ui";

export function ContinueLearningCardSkeleton() {
  return (
    <Card className="flex flex-wrap items-center gap-4 p-6">
      <Skeleton className="h-14 w-14 shrink-0 rounded-full" />
      <div className="min-w-0 flex-1">
        <Skeleton className="h-3 w-44" />
        <Skeleton className="mt-2 h-5 w-3/4 max-w-md" />
        <div className="mt-3 flex items-center gap-3">
          <Skeleton className="h-2 max-w-xs flex-1 rounded-full" />
          <Skeleton className="h-4 w-10" />
        </div>
      </div>
      <Skeleton className="h-10 w-24" />
    </Card>
  );
}
