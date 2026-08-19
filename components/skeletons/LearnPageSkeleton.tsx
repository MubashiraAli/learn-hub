import { Skeleton } from "@/components/ui";

export function LearnPageSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="mt-3 h-7 w-64 max-w-full" />
        </div>
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="mt-2 h-2 w-full rounded-full" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
            <div className="border-b border-zinc-100 p-4 dark:border-zinc-800">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="mt-1.5 h-4 w-32" />
            </div>
            {[0, 1, 2].map((module) => (
              <div
                key={module}
                className="border-b border-zinc-100 p-4 last:border-0 dark:border-zinc-800"
              >
                <Skeleton className="h-3 w-16" />
                <Skeleton className="mt-2 h-4 w-40" />
                {[0, 1, 2].map((lesson) => (
                  <div key={lesson} className="mt-3.5 flex items-center gap-3">
                    <Skeleton className="h-4 w-4 shrink-0 rounded-full" />
                    <Skeleton className="h-4 flex-1" />
                    <Skeleton className="h-3 w-8 shrink-0" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </aside>

        <main className="min-w-0">
          <div className="mb-4 flex items-center justify-between gap-3 lg:hidden">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-4 w-40" />
          </div>

          <Skeleton className="aspect-video w-full rounded-xl" />

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="mt-2 h-6 w-3/4 max-w-md" />
              <div className="mt-2 flex items-center gap-3">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            </div>
            <Skeleton className="h-10 w-36" />
          </div>

          <div className="mt-5 flex items-center justify-between gap-3">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>

          <div className="mt-8">
            <div className="flex gap-1 border-b border-zinc-200 dark:border-zinc-800">
              <Skeleton className="h-9 w-28" />
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-28" />
            </div>
            <div className="mt-5 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
