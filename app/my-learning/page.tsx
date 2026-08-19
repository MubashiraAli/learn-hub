import type { Metadata } from "next";
import { getAllCourses } from "@/lib/courses";
import { MyLearningClient } from "./my-learning-client";

export const metadata: Metadata = {
  title: "My Learning",
};

// Rendered on demand. The catalog is editable from /admin, so pages must
// reflect the current database rather than a build-time snapshot — and the
// build then needs no database connection at all.
export const dynamic = "force-dynamic";

export default async function MyLearningPage() {
  const courses = await getAllCourses();
  return <MyLearningClient courses={courses} />;
}
