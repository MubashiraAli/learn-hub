import { Card, CardContent, CardHeader, Skeleton } from "@/components/ui";

export function EnrollmentCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <Skeleton className="h-5 w-3/4 max-w-sm" />
            <Skeleton className="mt-2 h-4 w-56" />
            <Skeleton className="mt-2 h-5 w-24 rounded-full" />
          </div>
          <Skeleton className="h-10 w-28" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-1 flex items-center justify-between">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-10" />
        </div>
        <Skeleton className="h-2 w-full rounded-full" />
      </CardContent>
    </Card>
  );
}
