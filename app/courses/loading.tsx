import { Skeleton } from "@/components/ui";
import {
  CourseCardSkeleton,
  CourseFiltersSkeleton,
  SectionHeadingSkeleton,
} from "@/components/skeletons";

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <SectionHeadingSkeleton />
      <CourseFiltersSkeleton />
      <div className="mt-8">
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <CourseCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
