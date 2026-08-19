import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/session";
import {
  findLessonBySlug,
  getLearningProgress,
  syncEnrollmentProgress,
} from "@/lib/learning";
import { jsonError, readJson, unauthorized } from "@/lib/api";

export async function GET() {
  const userId = await getCurrentUserId();
  if (!userId) return unauthorized();
  return NextResponse.json({ progress: await getLearningProgress(userId) });
}

/**
 * Body: { courseId, lessonId (slug), action: "setCurrent" | "toggleCompleted" }
 *
 * Opening a lesson enrolls the user implicitly, which is what the original
 * localStorage behaviour did — progress was recorded on visit, not on enroll.
 */
export async function PUT(request: Request) {
  const userId = await getCurrentUserId();
  if (!userId) return unauthorized();

  const body = await readJson(request);
  const courseId = typeof body?.courseId === "string" ? body.courseId : "";
  const lessonSlug = typeof body?.lessonId === "string" ? body.lessonId : "";
  const action = body?.action;

  if (!courseId || !lessonSlug) {
    return jsonError("courseId and lessonId are required.", 400);
  }
  if (action !== "setCurrent" && action !== "toggleCompleted") {
    return jsonError("action must be setCurrent or toggleCompleted.", 400);
  }

  const lesson = await findLessonBySlug(courseId, lessonSlug);
  if (!lesson) return jsonError("Lesson not found in this course.", 404);

  // Only "setCurrent" moves the resume pointer. Marking a lesson complete
  // must not change it — that matches the original localStorage behaviour,
  // which kept `existing?.currentLessonId ?? lessonId`.
  await prisma.enrollment.upsert({
    where: { userId_courseId: { userId, courseId } },
    create: { userId, courseId, currentLessonId: lesson.id },
    update: action === "setCurrent" ? { currentLessonId: lesson.id } : {},
  });

  await prisma.user.update({
    where: { id: userId },
    data: { lastCourseId: courseId },
  });

  if (action === "setCurrent") {
    await prisma.progress.upsert({
      where: { userId_lessonId: { userId, lessonId: lesson.id } },
      create: { userId, courseId, lessonId: lesson.id, completed: false },
      update: { lastAccessedAt: new Date() },
    });
  } else {
    const existing = await prisma.progress.findUnique({
      where: { userId_lessonId: { userId, lessonId: lesson.id } },
      select: { completed: true },
    });
    const nextCompleted = !existing?.completed;

    await prisma.progress.upsert({
      where: { userId_lessonId: { userId, lessonId: lesson.id } },
      create: {
        userId,
        courseId,
        lessonId: lesson.id,
        completed: nextCompleted,
        completedAt: nextCompleted ? new Date() : null,
      },
      update: {
        completed: nextCompleted,
        completedAt: nextCompleted ? new Date() : null,
        lastAccessedAt: new Date(),
      },
    });
  }

  await syncEnrollmentProgress(userId, courseId);

  return NextResponse.json({ progress: await getLearningProgress(userId) });
}
