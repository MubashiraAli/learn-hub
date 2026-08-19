"use client";

import Link from "next/link";
import { PlayCircle } from "lucide-react";
import { useLearningProgress } from "@/hooks";
import { useAuth } from "@/hooks/use-auth";
import { Button, Card, Progress, StorageWarning } from "@/components/ui";
import type { Course } from "@/types";

export function ContinueLearningCard({
  courses,
}: {
  courses: Record<string, Course>;
}) {
  const { user } = useAuth();
  const { progress, storageError } = useLearningProgress(user?.id ?? null);

  const lastCourseId = progress.lastCourseId;
  const courseProgress = lastCourseId ? progress.courses[lastCourseId] : undefined;
  const course = lastCourseId ? courses[lastCourseId] : undefined;

  if (!course || !courseProgress) {
    return storageError ? (
      <StorageWarning label="Your course progress can't be saved right now." />
    ) : null;
  }

  const href = courseProgress.currentLessonId
    ? `/learn/${course.id}?lesson=${courseProgress.currentLessonId}`
    : `/learn/${course.id}`;

  return (
    <Card className="flex flex-wrap items-center gap-4 p-6">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white">
        <PlayCircle className="h-6 w-6" aria-hidden />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
          Continue where you left off
        </p>
        <p className="mt-0.5 truncate font-semibold text-zinc-900 dark:text-zinc-50">
          {course.title}
        </p>
        <div className="mt-3 flex items-center gap-3">
          <Progress value={courseProgress.progress} className="max-w-xs flex-1" />
          <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {courseProgress.progress}%
          </span>
        </div>
      </div>
      <Button asChild>
        <Link href={href}>Resume</Link>
      </Button>
    </Card>
  );
}
