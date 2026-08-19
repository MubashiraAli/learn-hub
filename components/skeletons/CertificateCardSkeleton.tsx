import { Card, CardHeader, Skeleton } from "@/components/ui";

export function CertificateCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <Skeleton className="h-12 w-12 rounded-xl" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="mt-4 h-5 w-3/4 max-w-xs" />
        <div className="mt-2 space-y-1.5">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-3 w-32" />
        </div>
        <Skeleton className="mt-4 h-10 w-full" />
      </CardHeader>
    </Card>
  );
}
