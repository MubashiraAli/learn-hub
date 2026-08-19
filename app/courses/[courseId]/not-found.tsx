import Link from "next/link";
import { BookX } from "lucide-react";
import { EmptyState, buttonVariants } from "@/components/ui";

export default function CourseNotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl items-center justify-center px-4 py-16 sm:px-6">
      <EmptyState
        icon={<BookX className="h-6 w-6" />}
        title="Course not found"
        description="We couldn't find the course you're looking for. It may have been removed or the link may be wrong."
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/courses" className={buttonVariants()}>
              Browse all courses
            </Link>
            <Link
              href="/"
              className={buttonVariants({ variant: "outline" })}
            >
              Back to home
            </Link>
          </div>
        }
      />
    </div>
  );
}
