"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { assertAdmin } from "@/lib/admin";

/**
 * Admin mutations. Every action calls assertAdmin() first — the guard lives on
 * the server side of the action boundary, so it cannot be skipped by calling
 * the endpoint directly.
 */

export type ActionResult = { ok: true } | { ok: false; error: string };

function str(form: FormData, key: string): string {
  const value = form.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function num(form: FormData, key: string, fallback = 0): number {
  const parsed = Number(str(form, key));
  return Number.isFinite(parsed) ? parsed : fallback;
}

/** undefined when the field was not submitted at all, trimmed string if it was. */
function optionalString(form: FormData, key: string): string | undefined {
  const value = form.get(key);
  return typeof value === "string" ? value.trim() : undefined;
}

function list(form: FormData, key: string): string[] {
  return str(form, key)
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Next free "m3" / "l7" style slug within a parent. */
function nextSlug(prefix: string, existing: string[]): string {
  let n = existing.length + 1;
  const taken = new Set(existing);
  while (taken.has(`${prefix}${n}`)) n += 1;
  return `${prefix}${n}`;
}

function refresh(courseId?: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/courses");
  revalidatePath("/courses");
  revalidatePath("/");
  if (courseId) {
    revalidatePath(`/admin/courses/${courseId}`);
    revalidatePath(`/courses/${courseId}`);
    revalidatePath(`/learn/${courseId}`);
    revalidatePath(`/quiz/${courseId}`);
  }
}

// ── Courses ──────────────────────────────────────────────────────────

export async function createCourse(form: FormData): Promise<ActionResult> {
  await assertAdmin();

  const title = str(form, "title");
  if (!title) return { ok: false, error: "Title is required." };

  const id = slugify(str(form, "id") || title);
  if (!id) return { ok: false, error: "Could not derive an id from the title." };

  const existing = await prisma.course.findUnique({
    where: { id },
    select: { id: true },
  });
  if (existing) {
    return { ok: false, error: `A course with the id "${id}" already exists.` };
  }

  await prisma.course.create({
    data: {
      id,
      title,
      description: str(form, "description"),
      category: str(form, "category") || "web-development",
      level: str(form, "level") || "beginner",
      instructorId: str(form, "instructorId") || "in-1",
      durationHours: num(form, "durationHours", 1),
      rating: num(form, "rating", 0),
      studentsCount: num(form, "studentsCount", 0),
      price: num(form, "price", 0),
      originalPrice: str(form, "originalPrice")
        ? num(form, "originalPrice")
        : null,
      language: str(form, "language") || "English",
      tags: list(form, "tags"),
      learningOutcomes: list(form, "learningOutcomes"),
      requirements: list(form, "requirements"),
      imageUrl: str(form, "imageUrl") || null,
      updatedAt: new Date(),
    },
  });

  refresh(id);
  redirect(`/admin/courses/${id}`);
}

export async function updateCourse(form: FormData): Promise<ActionResult> {
  await assertAdmin();
  const id = str(form, "id");
  if (!id) return { ok: false, error: "Missing course id." };

  const title = str(form, "title");
  if (!title) return { ok: false, error: "Title is required." };

  await prisma.course.update({
    where: { id },
    data: {
      title,
      description: str(form, "description"),
      category: str(form, "category"),
      level: str(form, "level"),
      instructorId: str(form, "instructorId"),
      durationHours: num(form, "durationHours", 1),
      rating: num(form, "rating", 0),
      studentsCount: num(form, "studentsCount", 0),
      price: num(form, "price", 0),
      originalPrice: str(form, "originalPrice")
        ? num(form, "originalPrice")
        : null,
      language: str(form, "language") || "English",
      tags: list(form, "tags"),
      learningOutcomes: list(form, "learningOutcomes"),
      requirements: list(form, "requirements"),
      imageUrl: str(form, "imageUrl") || null,
      updatedAt: new Date(),
    },
  });

  refresh(id);
  return { ok: true };
}

export async function deleteCourse(form: FormData): Promise<ActionResult> {
  await assertAdmin();
  const id = str(form, "id");
  if (!id) return { ok: false, error: "Missing course id." };

  // Cascades to modules, lessons, quiz, questions, enrollments, progress,
  // attempts and certificates for this course.
  await prisma.course.delete({ where: { id } });

  refresh(id);
  redirect("/admin/courses");
}

// ── Modules ──────────────────────────────────────────────────────────

export async function createModule(form: FormData): Promise<ActionResult> {
  await assertAdmin();
  const courseId = str(form, "courseId");
  const title = str(form, "title");
  if (!courseId) return { ok: false, error: "Missing course id." };
  if (!title) return { ok: false, error: "Module title is required." };

  const siblings = await prisma.module.findMany({
    where: { courseId },
    select: { slug: true, position: true },
  });

  await prisma.module.create({
    data: {
      courseId,
      title,
      slug: nextSlug("m", siblings.map((m) => m.slug)),
      position: siblings.length,
    },
  });

  refresh(courseId);
  return { ok: true };
}

export async function updateModule(form: FormData): Promise<ActionResult> {
  await assertAdmin();
  const id = str(form, "id");
  const title = str(form, "title");
  if (!id) return { ok: false, error: "Missing module id." };
  if (!title) return { ok: false, error: "Module title is required." };

  const updated = await prisma.module.update({
    where: { id },
    data: { title },
    select: { courseId: true },
  });

  refresh(updated.courseId);
  return { ok: true };
}

export async function deleteModule(form: FormData): Promise<ActionResult> {
  await assertAdmin();
  const id = str(form, "id");
  if (!id) return { ok: false, error: "Missing module id." };

  const removed = await prisma.module.delete({
    where: { id },
    select: { courseId: true },
  });

  refresh(removed.courseId);
  return { ok: true };
}

// ── Lessons ──────────────────────────────────────────────────────────

export async function createLesson(form: FormData): Promise<ActionResult> {
  await assertAdmin();
  const moduleId = str(form, "moduleId");
  const title = str(form, "title");
  if (!moduleId) return { ok: false, error: "Missing module id." };
  if (!title) return { ok: false, error: "Lesson title is required." };

  const parent = await prisma.module.findUnique({
    where: { id: moduleId },
    select: { courseId: true, lessons: { select: { slug: true } } },
  });
  if (!parent) return { ok: false, error: "Module not found." };

  await prisma.lesson.create({
    data: {
      moduleId,
      title,
      slug: nextSlug("l", parent.lessons.map((l) => l.slug)),
      description: str(form, "description"),
      type: str(form, "type") || "video",
      durationMinutes: num(form, "durationMinutes", 10),
      videoUrl: str(form, "videoUrl") || null,
      position: parent.lessons.length,
    },
  });

  refresh(parent.courseId);
  return { ok: true };
}

export async function updateLesson(form: FormData): Promise<ActionResult> {
  await assertAdmin();
  const id = str(form, "id");
  const title = str(form, "title");
  if (!id) return { ok: false, error: "Missing lesson id." };
  if (!title) return { ok: false, error: "Lesson title is required." };

  const videoUrl = optionalString(form, "videoUrl");

  const updated = await prisma.lesson.update({
    where: { id },
    data: {
      title,
      description: str(form, "description"),
      type: str(form, "type") || "video",
      durationMinutes: num(form, "durationMinutes", 10),
      // Absent field = leave as-is; present but empty = clear it.
      ...(videoUrl === undefined ? {} : { videoUrl: videoUrl || null }),
    },
    select: { module: { select: { courseId: true } } },
  });

  refresh(updated.module.courseId);
  return { ok: true };
}

export async function deleteLesson(form: FormData): Promise<ActionResult> {
  await assertAdmin();
  const id = str(form, "id");
  if (!id) return { ok: false, error: "Missing lesson id." };

  const removed = await prisma.lesson.delete({
    where: { id },
    select: { module: { select: { courseId: true } } },
  });

  refresh(removed.module.courseId);
  return { ok: true };
}

/**
 * Sets or clears just the video on one lesson. Separate from updateLesson so
 * the video screen does not have to resubmit title, type and duration (and so
 * cannot accidentally overwrite them).
 */
export async function setLessonVideo(form: FormData): Promise<ActionResult> {
  await assertAdmin();
  const id = str(form, "id");
  if (!id) return { ok: false, error: "Missing lesson id." };

  const raw = str(form, "videoUrl");

  if (raw) {
    // Reject anything that is not a URL early, with a message that says why.
    let parsed: URL | undefined;
    if (raw.startsWith("/")) {
      // A path under /public is fine.
    } else {
      try {
        parsed = new URL(raw);
      } catch {
        return {
          ok: false,
          error: "Enter a full URL (https://...) or a path starting with /.",
        };
      }
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        return { ok: false, error: "The URL must start with http:// or https://." };
      }
    }
  }

  const updated = await prisma.lesson.update({
    where: { id },
    data: { videoUrl: raw || null },
    select: { module: { select: { courseId: true } } },
  });

  refresh(updated.module.courseId);
  return { ok: true };
}

// ── Quizzes ──────────────────────────────────────────────────────────

export async function upsertQuiz(form: FormData): Promise<ActionResult> {
  await assertAdmin();
  const courseId = str(form, "courseId");
  const title = str(form, "title");
  if (!courseId) return { ok: false, error: "Missing course id." };
  if (!title) return { ok: false, error: "Quiz title is required." };

  const passScore = Math.min(100, Math.max(0, num(form, "passScore", 70)));
  const slug = str(form, "slug") || `quiz-${courseId}`;

  // One quiz per course is enforced by a unique constraint on courseId.
  await prisma.quiz.upsert({
    where: { courseId },
    create: { courseId, title, passScore, slug },
    update: { title, passScore },
  });

  refresh(courseId);
  return { ok: true };
}

export async function deleteQuiz(form: FormData): Promise<ActionResult> {
  await assertAdmin();
  const courseId = str(form, "courseId");
  if (!courseId) return { ok: false, error: "Missing course id." };

  await prisma.quiz.deleteMany({ where: { courseId } });

  refresh(courseId);
  return { ok: true };
}

// ── Quiz questions ───────────────────────────────────────────────────

function readOptions(form: FormData): string[] {
  return ["optionA", "optionB", "optionC", "optionD"]
    .map((key) => str(form, key))
    .filter(Boolean);
}

export async function createQuestion(form: FormData): Promise<ActionResult> {
  await assertAdmin();
  const quizId = str(form, "quizId");
  const prompt = str(form, "prompt");
  if (!quizId) return { ok: false, error: "Missing quiz id." };
  if (!prompt) return { ok: false, error: "Question text is required." };

  const options = readOptions(form);
  if (options.length < 2) {
    return { ok: false, error: "Provide at least two answer options." };
  }

  const correctIndex = num(form, "correctIndex", 0);
  if (correctIndex < 0 || correctIndex >= options.length) {
    return { ok: false, error: "The correct answer must be one of the options." };
  }

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    select: { courseId: true, questions: { select: { slug: true } } },
  });
  if (!quiz) return { ok: false, error: "Quiz not found." };

  await prisma.question.create({
    data: {
      quizId,
      prompt,
      options,
      correctIndex,
      slug: nextSlug("q", quiz.questions.map((q) => q.slug)),
      position: quiz.questions.length,
    },
  });

  refresh(quiz.courseId);
  return { ok: true };
}

export async function updateQuestion(form: FormData): Promise<ActionResult> {
  await assertAdmin();
  const id = str(form, "id");
  const prompt = str(form, "prompt");
  if (!id) return { ok: false, error: "Missing question id." };
  if (!prompt) return { ok: false, error: "Question text is required." };

  const options = readOptions(form);
  if (options.length < 2) {
    return { ok: false, error: "Provide at least two answer options." };
  }

  const correctIndex = num(form, "correctIndex", 0);
  if (correctIndex < 0 || correctIndex >= options.length) {
    return { ok: false, error: "The correct answer must be one of the options." };
  }

  const updated = await prisma.question.update({
    where: { id },
    data: { prompt, options, correctIndex },
    select: { quiz: { select: { courseId: true } } },
  });

  refresh(updated.quiz.courseId);
  return { ok: true };
}

export async function deleteQuestion(form: FormData): Promise<ActionResult> {
  await assertAdmin();
  const id = str(form, "id");
  if (!id) return { ok: false, error: "Missing question id." };

  const removed = await prisma.question.delete({
    where: { id },
    select: { quiz: { select: { courseId: true } } },
  });

  refresh(removed.quiz.courseId);
  return { ok: true };
}

// ── Users ────────────────────────────────────────────────────────────

export async function setUserRole(form: FormData): Promise<ActionResult> {
  const adminId = await assertAdmin();
  const userId = str(form, "userId");
  const role = str(form, "role");

  if (!userId) return { ok: false, error: "Missing user id." };
  if (role !== "USER" && role !== "ADMIN") {
    return { ok: false, error: "Role must be USER or ADMIN." };
  }
  if (userId === adminId && role === "USER") {
    return { ok: false, error: "You cannot remove your own admin access." };
  }

  await prisma.user.update({ where: { id: userId }, data: { role } });

  revalidatePath("/admin");
  return { ok: true };
}
