import Link from "next/link";
import { Compass } from "lucide-react";
import { EmptyState, buttonVariants } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl items-center justify-center px-4 py-16 sm:px-6">
      <EmptyState
        icon={<Compass className="h-6 w-6" />}
        title="Page not found"
        description="The page you're looking for doesn't exist or has been moved. Let's get you back on track."
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/" className={buttonVariants()}>
              Back to home
            </Link>
            <Link
              href="/courses"
              className={buttonVariants({ variant: "outline" })}
            >
              Browse courses
            </Link>
          </div>
        }
      />
    </div>
  );
}
