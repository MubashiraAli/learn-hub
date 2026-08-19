import "server-only";

import { prisma } from "@/lib/prisma";
import { courseInclude, toCourseDTO } from "@/lib/dto";
import { getInstructorById } from "@/data/instructors";
import type { Course, Quiz } from "@/types";

/**
 * Database-backed replacements for the readers that used to live in
 * `data/courses.ts`. That file is now only the seed source plus the pure
 * helpers that compute over a Course object already in hand
 * (getTotalLessons, getTotalDurationMinutes, getCourseRating).
 */

export async function getAllCourses(): Promise<Course[]> {
  const rows = await prisma.course.findMany({
    include: courseInclude,
    orderBy: { title: "asc" },
  });
  return rows.map(toCourseDTO);
}

export async function getCourseById(id: string): Promise<Course | undefined> {
  const row = await prisma.course.findUnique({
    where: { id },
    include: courseInclude,
  });
  return row ? toCourseDTO(row) : undefined;
}

/** Several courses at once, returned as a lookup for client components. */
export async function getCoursesByIds(
  ids: string[],
): Promise<Record<string, Course>> {
  if (ids.length === 0) return {};
  const rows = await prisma.course.findMany({
    where: { id: { in: ids } },
    include: courseInclude,
  });
  return Object.fromEntries(rows.map((row) => [row.id, toCourseDTO(row)]));
}

export async function getCoursesByCategory(
  category: string,
): Promise<Course[]> {
  if (!category) return getAllCourses();
  const rows = await prisma.course.findMany({
    where: { category },
    include: courseInclude,
    orderBy: { title: "asc" },
  });
  return rows.map(toCourseDTO);
}

export async function getQuizByCourseId(
  courseId: string,
): Promise<Quiz | undefined> {
  const course = await getCourseById(courseId);
  return course?.quiz;
}

/**
 * Matches the original semantics: title, description, instructor name,
 * category and tags. Instructors are still static data, so the join happens
 * in memory over a small catalog rather than in SQL.
 */
export async function searchCourses(query: string): Promise<Course[]> {
  const all = await getAllCourses();
  const normalized = query.trim().toLowerCase();
  if (!normalized) return all;

  return all.filter((course) => {
    const instructor = getInstructorById(course.instructorId);
    return [
      course.title,
      course.description,
      instructor?.name ?? "",
      course.category,
      ...course.tags,
    ]
      .join(" ")
      .toLowerCase()
      .includes(normalized);
  });
}

export async function getRelatedCourses(
  course: Course,
  limit = 3,
): Promise<Course[]> {
  const sameCategory = await prisma.course.findMany({
    where: { category: course.category, NOT: { id: course.id } },
    include: courseInclude,
    take: limit,
  });
  if (sameCategory.length >= limit) {
    return sameCategory.map(toCourseDTO);
  }

  const others = await prisma.course.findMany({
    where: {
      NOT: {
        OR: [
          { id: course.id },
          { id: { in: sameCategory.map((c) => c.id) } },
        ],
      },
    },
    include: courseInclude,
    orderBy: { rating: "desc" },
    take: limit - sameCategory.length,
  });

  return [...sameCategory, ...others].map(toCourseDTO).slice(0, limit);
}

/** Course count per category, for the category cards on the home page. */
export async function getCourseCountsByCategory(): Promise<
  Record<string, number>
> {
  const rows = await prisma.course.groupBy({
    by: ["category"],
    _count: { _all: true },
  });
  return Object.fromEntries(rows.map((r) => [r.category, r._count._all]));
}

/** Catalog totals used by the home page hero and stats band. */
export async function getCatalogStats(): Promise<{
  courseCount: number;
  studentTotal: number;
  lessonTotal: number;
}> {
  const [courseCount, lessonTotal, students] = await Promise.all([
    prisma.course.count(),
    prisma.lesson.count(),
    prisma.course.aggregate({ _sum: { studentsCount: true } }),
  ]);
  return {
    courseCount,
    lessonTotal,
    studentTotal: students._sum.studentsCount ?? 0,
  };
}
