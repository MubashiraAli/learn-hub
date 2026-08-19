import { Skeleton } from "@/components/ui";
import {
  ContinueLearningCardSkeleton,
  EnrollmentCardSkeleton,
  SectionHeadingSkeleton,
} from "@/components/skeletons";

export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <SectionHeadingSkeleton />
      <div className="mt-8">
        <ContinueLearningCardSkeleton />
      </div>
      <div className="mt-8 space-y-4">
        <EnrollmentCardSkeleton />
        <EnrollmentCardSkeleton />
      </div>
      <Skeleton className="mt-8 h-16 w-full rounded-xl" />
    </div>
  );
}
