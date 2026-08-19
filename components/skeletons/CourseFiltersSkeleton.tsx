import { Skeleton } from "@/components/ui";

export function CourseFiltersSkeleton() {
  return (
    <div className="mt-8 space-y-4">
      <Skeleton className="h-11 w-full max-w-xl" />
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-8 w-16 rounded-full" />
        <Skeleton className="h-8 w-24 rounded-full" />
        <Skeleton className="h-8 w-20 rounded-full" />
        <Skeleton className="h-8 w-24 rounded-full" />
        <Skeleton className="h-8 w-28 rounded-full" />
        <Skeleton className="h-8 w-20 rounded-full" />
      </div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1">
            <Skeleton className="h-3 w-10" />
            <Skeleton className="h-10 w-40" />
          </div>
          <div className="flex flex-col gap-1">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-10 w-36" />
          </div>
          <div className="flex flex-col gap-1">
            <Skeleton className="h-3 w-10" />
            <Skeleton className="h-10 w-36" />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-10 w-40" />
        </div>
      </div>
    </div>
  );
}
