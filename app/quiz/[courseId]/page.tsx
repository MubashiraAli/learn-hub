import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCourseById, getQuizByCourseId } from "@/lib/courses";
import { QuizRunner } from "@/components/QuizRunner";

interface QuizPageProps {
  params: Promise<{ courseId: string }>;
}

// Rendered on demand. The catalog is editable from /admin, so pages must
// reflect the current database rather than a build-time snapshot — and the
// build then needs no database connection at all.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: QuizPageProps): Promise<Metadata> {
  const { courseId } = await params;
  const course = await getCourseById(courseId);
  return {
    title: course ? `${course.title} · Quiz` : "Quiz not found",
  };
}

export default async function QuizPage({ params }: QuizPageProps) {
  const { courseId } = await params;
  const [course, quiz] = await Promise.all([
    getCourseById(courseId),
    getQuizByCourseId(courseId),
  ]);

  if (!course || !quiz) notFound();

  return <QuizRunner course={course} quiz={quiz} />;
}
