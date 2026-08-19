import { Card, CardContent, CardHeader, Skeleton } from "@/components/ui";

export function ProfileSkeleton() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Skeleton className="h-4 w-20" />
          <Skeleton className="mt-1 h-8 w-40" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="mt-8 space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <Skeleton className="h-20 w-20 shrink-0 rounded-full" />
              <div className="min-w-0 flex-1">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="mt-2 h-4 w-32" />
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-28" />
                </div>
                <Skeleton className="mt-3 h-4 w-3/4 max-w-lg" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-44" />
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 border-t border-zinc-100 pt-6 sm:grid-cols-2 lg:grid-cols-3 dark:border-zinc-800">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index}>
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="mt-1 h-7 w-16" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-24" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 border-t border-zinc-100 pt-6 dark:border-zinc-800">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-6 w-20 rounded-full" />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-36" />
          </CardHeader>
          <CardContent>
            <ol className="space-y-5 border-t border-zinc-100 pt-6 dark:border-zinc-800">
              {Array.from({ length: 4 }).map((_, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-3.5 w-1/2" />
                  </div>
                  <Skeleton className="h-3.5 w-16 shrink-0" />
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
