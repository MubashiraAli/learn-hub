import type { Metadata } from "next";
import { getAllCourses } from "@/lib/courses";
import { ProfileViewer } from "@/components/ProfileViewer";

export const metadata: Metadata = {
  title: "Profile",
};

export default async function ProfilePage() {
  const courses = await getAllCourses();

  const courseTitles = Object.fromEntries(
    courses.map((course) => [course.id, course.title]),
  );

  const lessonDurations = Object.fromEntries(
    courses.map((course) => [
      course.id,
      Object.fromEntries(
        course.modules.flatMap((module) => module.lessons).map((lesson) => [
          lesson.id,
          lesson.durationMinutes,
        ]),
      ),
    ]),
  );

  return (
    <ProfileViewer
      courseTitles={courseTitles}
      lessonDurations={lessonDurations}
    />
  );
}
