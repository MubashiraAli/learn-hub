import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { EmptyState, buttonVariants } from "@/components/ui";

export default function LearnCourseNotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl items-center justify-center px-4 py-16 sm:px-6">
      <EmptyState
        icon={<FileQuestion className="h-6 w-6" />}
        title="Course not found"
        description="The course you're trying to study doesn't exist or is no longer available. Your saved progress is safe."
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/my-learning" className={buttonVariants()}>
              Go to My Learning
            </Link>
            <Link href="/courses" className={buttonVariants({ variant: "outline" })}>
              Browse courses
            </Link>
          </div>
        }
      />
    </div>
  );
}
