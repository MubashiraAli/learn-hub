import type { Prisma } from "@prisma/client";
import type {
  Certificate,
  Course,
  CourseCategory,
  CourseLevel,
  CourseProgress,
  LearningProgress,
  Lesson,
  LessonResource,
  LessonResourceKind,
  LessonType,
  Module,
  Quiz,
  QuizQuestion,
  QuizResult,
  User,
  UserRole,
} from "@/types";

/**
 * Maps database rows onto the shapes the UI already consumes.
 *
 * The important translation is identity: module/lesson/question ids are only
 * unique within their parent in the source data ("m1", "l1", "q1" repeat in
 * every course), so the database gives each row a generated primary key and
 * keeps the original id in `slug`. Everything the UI sees uses the slug, which
 * is why no component had to change.
 */

// ── Users ────────────────────────────────────────────────────────────

export type UserRow = Prisma.UserGetPayload<{
  include: { enrollments: { select: { courseId: true } } };
}>;

export function toUserDTO(row: UserRow): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role as UserRole,
    enrolledCourseIds: row.enrollments.map((e) => e.courseId),
    memberSince: row.memberSince.toISOString(),
    phone: row.phone ?? "",
    address: row.address ?? "",
    city: row.city ?? "",
    state: row.state ?? "",
    country: row.country ?? "",
    bio: row.bio ?? "",
    skills: row.skills,
    avatarUrl: row.avatarUrl ?? "",
    title: row.title ?? "",
  };
}

// ── Catalog ──────────────────────────────────────────────────────────

export type CourseRow = Prisma.CourseGetPayload<{
  include: {
    modules: {
      include: {
        lessons: { include: { resources: true } };
      };
    };
    quiz: { include: { questions: true } };
  };
}>;

/** Include clause that loads a whole course tree in the right order. */
export const courseInclude = {
  modules: {
    orderBy: { position: "asc" },
    include: {
      lessons: {
        orderBy: { position: "asc" },
        include: {
          resources: { orderBy: { position: "asc" } },
        },
      },
    },
  },
  quiz: {
    include: {
      questions: { orderBy: { position: "asc" } },
    },
  },
} satisfies Prisma.CourseInclude;

function toResourceDTO(
  row: CourseRow["modules"][number]["lessons"][number]["resources"][number],
): LessonResource {
  return {
    id: row.slug,
    title: row.title,
    url: row.url,
    kind: row.kind as LessonResourceKind,
  };
}

function toLessonDTO(
  row: CourseRow["modules"][number]["lessons"][number],
): Lesson {
  return {
    id: row.slug,
    title: row.title,
    durationMinutes: row.durationMinutes,
    type: row.type as LessonType,
    description: row.description,
    resources: row.resources.map(toResourceDTO),
  };
}

function toModuleDTO(row: CourseRow["modules"][number]): Module {
  return {
    id: row.slug,
    title: row.title,
    lessons: row.lessons.map(toLessonDTO),
  };
}

function toQuestionDTO(
  row: NonNullable<CourseRow["quiz"]>["questions"][number],
): QuizQuestion {
  return {
    id: row.slug,
    question: row.prompt,
    options: row.options,
    correctIndex: row.correctIndex,
  };
}

function toQuizDTO(row: NonNullable<CourseRow["quiz"]>): Quiz {
  return {
    id: row.slug,
    courseId: row.courseId,
    title: row.title,
    passScore: row.passScore,
    questions: row.questions.map(toQuestionDTO),
  };
}

export function toCourseDTO(row: CourseRow): Course {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category as CourseCategory,
    level: row.level as CourseLevel,
    instructorId: row.instructorId,
    durationHours: row.durationHours,
    rating: row.rating,
    studentsCount: row.studentsCount,
    price: row.price,
    originalPrice: row.originalPrice ?? undefined,
    language: row.language,
    tags: row.tags,
    learningOutcomes: row.learningOutcomes,
    requirements: row.requirements,
    imageUrl: row.imageUrl ?? undefined,
    updatedAt: row.updatedAt.toISOString().slice(0, 10),
    modules: row.modules.map(toModuleDTO),
    quiz: row.quiz ? toQuizDTO(row.quiz) : undefined,
  };
}

// ── Learner activity ─────────────────────────────────────────────────

export type CertificateRow = Prisma.CertificateGetPayload<object>;

export function toCertificateDTO(row: CertificateRow): Certificate {
  return {
    id: row.id,
    courseId: row.courseId,
    issuedAt: row.issuedAt.toISOString(),
    score: row.score,
  };
}

export type QuizAttemptRow = Prisma.QuizAttemptGetPayload<object>;

export function toQuizResultDTO(row: QuizAttemptRow): QuizResult {
  return {
    courseId: row.courseId,
    score: row.score,
    correctCount: row.correctCount,
    totalQuestions: row.totalQuestions,
    passed: row.passed,
    completedAt: row.completedAt.toISOString(),
  };
}

export type ProgressRow = Prisma.ProgressGetPayload<{
  include: { lesson: { select: { slug: true } } };
}>;

export type EnrollmentRow = Prisma.EnrollmentGetPayload<object>;

/**
 * Rebuilds the `LearningProgress` shape the UI expects from per-lesson rows.
 * `currentLessonSlugByCourse` comes from each enrollment's currentLessonId,
 * already resolved to a slug by the caller.
 */
export function toLearningProgressDTO(
  progressRows: ProgressRow[],
  enrollments: EnrollmentRow[],
  currentLessonSlugByCourse: Record<string, string>,
  lastCourseId: string | null,
  totalLessonsByCourse: Record<string, number>,
): LearningProgress {
  const courses: Record<string, CourseProgress> = {};

  for (const enrollment of enrollments) {
    courses[enrollment.courseId] = {
      courseId: enrollment.courseId,
      completedLessonIds: [],
      currentLessonId: currentLessonSlugByCourse[enrollment.courseId] ?? "",
      progress: enrollment.progress,
      lastAccessedAt: enrollment.startedAt.toISOString(),
    };
  }

  for (const row of progressRows) {
    const existing = courses[row.courseId] ?? {
      courseId: row.courseId,
      completedLessonIds: [],
      currentLessonId: currentLessonSlugByCourse[row.courseId] ?? "",
      progress: 0,
      lastAccessedAt: row.lastAccessedAt.toISOString(),
    };

    if (row.completed) {
      existing.completedLessonIds.push(row.lesson.slug);
    }

    const accessed = row.lastAccessedAt.toISOString();
    if (accessed > existing.lastAccessedAt) {
      existing.lastAccessedAt = accessed;
    }

    courses[row.courseId] = existing;
  }

  // Recompute the percentage from the lesson rows so it cannot drift from the
  // denormalised value on Enrollment.
  for (const [courseId, courseProgress] of Object.entries(courses)) {
    const total = totalLessonsByCourse[courseId] ?? 0;
    courseProgress.progress =
      total > 0
        ? Math.round((courseProgress.completedLessonIds.length / total) * 100)
        : 0;
  }

  return { lastCourseId, courses };
}
