"use client";

import Link from "next/link";
import { ArrowRight, GraduationCap } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useLearningProgress } from "@/hooks";
import { SectionHeading } from "@/components/SectionHeading";
import { ContinueLearningCard } from "@/components/ContinueLearningCard";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  EmptyState,
  Progress,
} from "@/components/ui";
import { formatDate } from "@/lib/utils";
import type { Course, CourseProgress } from "@/types";

export function MyLearningClient({ courses }: { courses: Course[] }) {
  const { user, certificates } = useAuth();
  const { progress } = useLearningProgress(user?.id ?? null);

  const courseLookup = Object.fromEntries(
    courses.map((course) => [course.id, course]),
  ) as Record<string, Course>;

  const enrolledCourseIds = user?.enrolledCourseIds ?? [];

  const enrolled = enrolledCourseIds
    .map((courseId) => {
      const course = courseLookup[courseId];
      if (!course) return null;
      return { course, courseProgress: progress.courses[courseId] };
    })
    .filter(
      (entry): entry is { course: Course; courseProgress: CourseProgress } =>
        entry !== null,
    );

  const completedCourses = enrolled.filter(
    (e) => e.courseProgress && e.courseProgress.progress === 100,
  );

  const inProgressCourses = enrolled.filter(
    (e) => !e.courseProgress || e.courseProgress.progress < 100,
  );

  const userName = user?.name ?? "there";
  const enrolledCount = enrolledCourseIds.length;
  const certCount = certificates.length;

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <SectionHeading
        eyebrow="Dashboard"
        title="My Learning"
        description={`Continue where you left off, ${userName}.`}
      />

      <div className="mt-8">
        <ContinueLearningCard courses={courseLookup} />
      </div>

      {/* In Progress */}
      {inProgressCourses.length > 0 ? (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            In Progress
          </h2>
          <div className="mt-4 space-y-4">
            {inProgressCourses.map(({ course, courseProgress }) => {
              const percent = courseProgress?.progress ?? 0;
              return (
                <Card key={course.id}>
                  <CardHeader>
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <CardTitle>{course.title}</CardTitle>
                        <CardDescription className="mt-2">
                          {percent > 0 ? (
                            <>Started {courseProgress ? formatDate(courseProgress.completedLessonIds.length > 0 ? progress.courses[course.id]?.lastAccessedAt ?? "" : "") : "recently"}</>
                          ) : (
                            "Not started yet"
                          )}{" "}
                          · <Badge variant="warning">In progress</Badge>
                        </CardDescription>
                      </div>
                      <Button asChild>
                        <Link href={`/learn/${course.id}`}>
                          {percent > 0 ? "Continue" : "Start"}
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-1 flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400">
                      <span>Progress</span>
                      <span>{percent}%</span>
                    </div>
                    <Progress value={percent} />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* Completed */}
      {completedCourses.length > 0 ? (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Completed Courses
          </h2>
          <div className="mt-4 space-y-4">
            {completedCourses.map(({ course, courseProgress }) => (
              <Card key={course.id}>
                <CardHeader>
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <CardTitle>{course.title}</CardTitle>
                      <CardDescription className="mt-2">
                        <Badge variant="success">Completed</Badge>
                        {certificates.find((c) => c.courseId === course.id) ? (
                          <span className="ml-2">
                            <Badge variant="success">Certificate earned</Badge>
                          </span>
                        ) : null}
                      </CardDescription>
                    </div>
                    <Button asChild variant="outline">
                      <Link href={`/learn/${course.id}`}>
                        Review
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-1 flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400">
                    <span>Progress</span>
                    <span>{courseProgress?.progress ?? 100}%</span>
                  </div>
                  <Progress value={courseProgress?.progress ?? 100} />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : null}

      {enrolled.length === 0 ? (
        <EmptyState
          icon={<GraduationCap className="h-6 w-6" />}
          title="No courses yet"
          description="Enroll in a course to start tracking your learning progress."
          action={
            <Button asChild>
              <Link href="/courses">Browse courses</Link>
            </Button>
          }
        />
      ) : null}

      <div className="mt-8 rounded-xl border border-dashed border-zinc-300 p-6 text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
        Enrolled in {enrolledCount} of{" "}
        {courses.length} courses ·{" "}
        {certCount} certificate{certCount === 1 ? "" : "s"} earned.{" "}
        <Link
          href="/courses"
          className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
        >
          Explore the catalog →
        </Link>
      </div>
    </div>
  );
}
