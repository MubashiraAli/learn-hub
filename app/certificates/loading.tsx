import {
  CertificateCardSkeleton,
  SectionHeadingSkeleton,
} from "@/components/skeletons";

export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <SectionHeadingSkeleton />
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <CertificateCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
