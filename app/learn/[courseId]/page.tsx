import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCourseById } from "@/lib/courses";
import { LearnPlayer } from "@/components/LearnPlayer";

interface LearnPageProps {
  params: Promise<{ courseId: string }>;
  searchParams: Promise<{ lesson?: string | string[] }>;
}

export async function generateMetadata({
  params,
}: LearnPageProps): Promise<Metadata> {
  const { courseId } = await params;
  const course = await getCourseById(courseId);
  return {
    title: course ? `${course.title} · Learn` : "Course not found",
  };
}

export default async function LearnPage({
  params,
  searchParams,
}: LearnPageProps) {
  const { courseId } = await params;
  const course = await getCourseById(courseId);

  if (!course) notFound();

  const { lesson } = await searchParams;
  const requestedLessonId = Array.isArray(lesson) ? lesson[0] : lesson;
  const firstLessonId = course.modules[0]?.lessons[0]?.id;

  const hasLesson = course.modules.some((module) =>
    module.lessons.some((item) => item.id === requestedLessonId),
  );

  return (
    <LearnPlayer
      course={course}
      initialLessonId={hasLesson ? requestedLessonId! : firstLessonId ?? ""}
    />
  );
}
