import { Card, CardContent, Skeleton } from "@/components/ui";

export function CourseCardSkeleton() {
  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <Skeleton className="aspect-video w-full rounded-none" />
      <CardContent className="flex flex-1 flex-col p-5 pt-0">
        <div className="mb-3 flex items-center justify-between gap-2">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-3.5 w-14" />
        </div>
        <Skeleton className="h-5 w-full" />
        <Skeleton className="mt-2 h-5 w-2/3" />
        <div className="mt-3 flex items-center gap-2">
          <Skeleton className="h-6 w-6 shrink-0 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="mt-4 flex items-center gap-4 border-t border-zinc-100 pt-4 dark:border-zinc-800">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-14" />
          <Skeleton className="h-4 w-12" />
        </div>
        <div className="mt-4 flex flex-1 flex-col justify-end">
          <div className="flex items-center justify-between gap-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-5 w-14 rounded-full" />
          </div>
          <Skeleton className="mt-4 h-9 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}
