import { prisma } from "@/lib/prisma";
import { toLearningProgressDTO } from "@/lib/dto";
import type { LearningProgress } from "@/types";

/**
 * Rebuilds a user's LearningProgress from the database in the shape the
 * existing `useLearningProgress` consumers expect.
 */
export async function getLearningProgress(
  userId: string,
): Promise<LearningProgress> {
  const [user, enrollments, progressRows] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { lastCourseId: true },
    }),
    prisma.enrollment.findMany({ where: { userId } }),
    prisma.progress.findMany({
      where: { userId },
      include: { lesson: { select: { slug: true } } },
    }),
  ]);

  const courseIds = new Set<string>([
    ...enrollments.map((e) => e.courseId),
    ...progressRows.map((p) => p.courseId),
  ]);

  // Lesson totals per course, needed to recompute the completion percentage.
  const totals = await prisma.lesson.groupBy({
    by: ["moduleId"],
    _count: { _all: true },
    where: { module: { courseId: { in: [...courseIds] } } },
  });
  const modules = await prisma.module.findMany({
    where: { courseId: { in: [...courseIds] } },
    select: { id: true, courseId: true },
  });
  const courseByModule = new Map(modules.map((m) => [m.id, m.courseId]));
  const totalLessonsByCourse: Record<string, number> = {};
  for (const row of totals) {
    const courseId = courseByModule.get(row.moduleId);
    if (!courseId) continue;
    totalLessonsByCourse[courseId] =
      (totalLessonsByCourse[courseId] ?? 0) + row._count._all;
  }

  // Resolve each enrollment's current lesson id back to its slug.
  const currentLessonIds = enrollments
    .map((e) => e.currentLessonId)
    .filter((id): id is string => Boolean(id));
  const currentLessons = currentLessonIds.length
    ? await prisma.lesson.findMany({
        where: { id: { in: currentLessonIds } },
        select: { id: true, slug: true },
      })
    : [];
  const slugByLessonId = new Map(currentLessons.map((l) => [l.id, l.slug]));

  const currentLessonSlugByCourse: Record<string, string> = {};
  for (const enrollment of enrollments) {
    if (!enrollment.currentLessonId) continue;
    const slug = slugByLessonId.get(enrollment.currentLessonId);
    if (slug) currentLessonSlugByCourse[enrollment.courseId] = slug;
  }

  return toLearningProgressDTO(
    progressRows,
    enrollments,
    currentLessonSlugByCourse,
    user?.lastCourseId ?? null,
    totalLessonsByCourse,
  );
}

/** Finds a lesson by its per-course slug (e.g. "l1" inside a given course). */
export async function findLessonBySlug(courseId: string, lessonSlug: string) {
  return prisma.lesson.findFirst({
    where: { slug: lessonSlug, module: { courseId } },
    select: { id: true, slug: true, moduleId: true },
  });
}

/** Total lessons in a course, used to recompute the enrollment percentage. */
export async function countLessons(courseId: string): Promise<number> {
  return prisma.lesson.count({ where: { module: { courseId } } });
}

/** Recomputes and stores the denormalised percentage on the enrollment row. */
export async function syncEnrollmentProgress(
  userId: string,
  courseId: string,
): Promise<void> {
  const [completed, total] = await Promise.all([
    prisma.progress.count({ where: { userId, courseId, completed: true } }),
    countLessons(courseId),
  ]);
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  await prisma.enrollment.updateMany({
    where: { userId, courseId },
    data: {
      progress: percent,
      completedAt: percent === 100 ? new Date() : null,
    },
  });
}

/**
 * A course counts as complete only when every one of its lessons has a
 * completed Progress row for this user. This is the gate for issuing a
 * certificate.
 */
export async function getCourseCompletion(
  userId: string,
  courseId: string,
): Promise<{ total: number; completed: number; isComplete: boolean }> {
  const [total, completed] = await Promise.all([
    countLessons(courseId),
    prisma.progress.count({ where: { userId, courseId, completed: true } }),
  ]);
  return { total, completed, isComplete: total > 0 && completed >= total };
}
