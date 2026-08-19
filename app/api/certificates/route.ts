import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/session";
import { toCertificateDTO } from "@/lib/dto";
import { jsonError, readJson, unauthorized } from "@/lib/api";
import { getCourseCompletion } from "@/lib/learning";

export async function GET() {
  const userId = await getCurrentUserId();
  if (!userId) return unauthorized();

  const rows = await prisma.certificate.findMany({
    where: { userId },
    orderBy: { issuedAt: "desc" },
  });
  return NextResponse.json({ certificates: rows.map(toCertificateDTO) });
}

export async function POST(request: Request) {
  const userId = await getCurrentUserId();
  if (!userId) return unauthorized();

  const body = await readJson(request);
  const courseId = typeof body?.courseId === "string" ? body.courseId : "";
  const score = typeof body?.score === "number" ? Math.round(body.score) : NaN;

  if (!courseId) return jsonError("courseId is required.", 400);
  if (!Number.isFinite(score) || score < 0 || score > 100) {
    return jsonError("score must be between 0 and 100.", 400);
  }

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: { id: true, quiz: { select: { passScore: true } } },
  });
  if (!course) return jsonError("Course not found.", 404);

  // A certificate requires the whole course, not just a passing quiz. This is
  // enforced here rather than in the client so it cannot be bypassed.
  const completion = await getCourseCompletion(userId, courseId);
  if (!completion.isComplete) {
    return jsonError(
      `Complete all lessons first — ${completion.completed} of ${completion.total} done.`,
      409,
    );
  }

  const passScore = course.quiz?.passScore ?? 70;
  if (score < passScore) {
    return jsonError(
      `A score of ${passScore}% or higher is required to earn a certificate.`,
      409,
    );
  }

  // One certificate per course: the first issue wins.
  const certificate = await prisma.certificate.upsert({
    where: { userId_courseId: { userId, courseId } },
    create: { userId, courseId, score },
    update: {},
  });

  return NextResponse.json({ certificate: toCertificateDTO(certificate) });
}
