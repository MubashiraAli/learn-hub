"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { buttonVariants } from "@/components/ui";

export function EnrollButton({ courseId }: { courseId: string }) {
  const { user, enrollInCourse } = useAuth();
  const router = useRouter();
  const isEnrolled = user?.enrolledCourseIds.includes(courseId) ?? false;

  async function handleEnroll() {
    if (!isEnrolled) {
      await enrollInCourse(courseId);
    }
    router.push(`/learn/${courseId}`);
  }

  return (
    <button
      type="button"
      onClick={() => void handleEnroll()}
      className={buttonVariants({ size: "lg", className: "w-full" })}
    >
      {isEnrolled ? "Continue learning" : "Enroll now"}
    </button>
  );
}
