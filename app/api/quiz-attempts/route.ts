import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/session";
import { toQuizResultDTO } from "@/lib/dto";
import { jsonError, readJson, unauthorized } from "@/lib/api";
import type { QuizResult } from "@/types";

/** Latest attempt per course, keyed by courseId — the shape the UI expects. */
export async function GET() {
  const userId = await getCurrentUserId();
  if (!userId) return unauthorized();

  const rows = await prisma.quizAttempt.findMany({
    where: { userId },
    orderBy: { completedAt: "desc" },
  });

  const latest: Record<string, QuizResult> = {};
  for (const row of rows) {
    if (!latest[row.courseId]) latest[row.courseId] = toQuizResultDTO(row);
  }
  return NextResponse.json({ results: latest });
}

export async function POST(request: Request) {
  const userId = await getCurrentUserId();
  if (!userId) return unauthorized();

  const body = await readJson(request);
  const courseId = typeof body?.courseId === "string" ? body.courseId : "";
  const score = typeof body?.score === "number" ? Math.round(body.score) : NaN;
  const correctCount =
    typeof body?.correctCount === "number" ? body.correctCount : NaN;
  const totalQuestions =
    typeof body?.totalQuestions === "number" ? body.totalQuestions : NaN;

  if (!courseId) return jsonError("courseId is required.", 400);
  if (
    !Number.isFinite(score) ||
    !Number.isFinite(correctCount) ||
    !Number.isFinite(totalQuestions)
  ) {
    return jsonError("score, correctCount and totalQuestions are required.", 400);
  }

  const quiz = await prisma.quiz.findUnique({
    where: { courseId },
    select: { id: true, passScore: true },
  });
  if (!quiz) return jsonError("This course has no quiz.", 404);

  const attempt = await prisma.quizAttempt.create({
    data: {
      userId,
      quizId: quiz.id,
      courseId,
      score,
      correctCount,
      totalQuestions,
      passed: score >= quiz.passScore,
    },
  });

  return NextResponse.json({ result: toQuizResultDTO(attempt) });
}
