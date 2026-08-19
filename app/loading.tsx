import {
  CourseCardSkeleton,
  SectionHeadingSkeleton,
} from "@/components/skeletons";

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <SectionHeadingSkeleton />
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <CourseCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
