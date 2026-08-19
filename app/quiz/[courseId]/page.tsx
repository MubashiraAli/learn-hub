import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAllCourses,
  getCourseById,
  getQuizByCourseId,
} from "@/lib/courses";
import { QuizRunner } from "@/components/QuizRunner";

interface QuizPageProps {
  params: Promise<{ courseId: string }>;
}

export async function generateStaticParams() {
  const courses = await getAllCourses();
  return courses
    .filter((course) => course.quiz)
    .map((course) => ({ courseId: course.id }));
}

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
