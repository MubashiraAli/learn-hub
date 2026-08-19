import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/session";
import { toUserDTO } from "@/lib/dto";
import { jsonError, readJson, unauthorized } from "@/lib/api";

export async function POST(request: Request) {
  const userId = await getCurrentUserId();
  if (!userId) return unauthorized();

  const body = await readJson(request);
  const courseId = typeof body?.courseId === "string" ? body.courseId : "";
  if (!courseId) return jsonError("courseId is required.", 400);

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: { id: true },
  });
  if (!course) return jsonError("Course not found.", 404);

  // Idempotent: enrolling twice is a no-op rather than an error.
  await prisma.enrollment.upsert({
    where: { userId_courseId: { userId, courseId } },
    create: { userId, courseId },
    update: {},
  });

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    include: { enrollments: { select: { courseId: true } } },
  });

  return NextResponse.json({ user: toUserDTO(user) });
}
