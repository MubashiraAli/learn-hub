import type { Certificate, LearningProgress, QuizResult, User } from "@/types";

/** Thrown for non-2xx responses so callers can surface the server's message. */
export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(
  url: string,
  init?: RequestInit & { json?: unknown },
): Promise<T> {
  const { json, ...rest } = init ?? {};
  const response = await fetch(url, {
    ...rest,
    headers:
      json !== undefined
        ? { "Content-Type": "application/json", ...(rest.headers ?? {}) }
        : rest.headers,
    body: json !== undefined ? JSON.stringify(json) : rest.body,
    credentials: "same-origin",
  });

  let payload: unknown = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const message =
      payload &&
      typeof payload === "object" &&
      typeof (payload as { error?: unknown }).error === "string"
        ? (payload as { error: string }).error
        : "Something went wrong. Please try again.";
    throw new ApiError(message, response.status);
  }

  return payload as T;
}

export const emptyProgress: LearningProgress = {
  lastCourseId: null,
  courses: {},
};

export function fetchMe() {
  return request<{ user: User | null }>("/api/auth/me");
}

export function apiLogin(email: string, password: string) {
  return request<{ user: User }>("/api/auth/login", {
    method: "POST",
    json: { email, password },
  });
}

export function apiSignup(name: string, email: string, password: string) {
  return request<{ user: User }>("/api/auth/signup", {
    method: "POST",
    json: { name, email, password },
  });
}

export function apiLogout() {
  return request<{ ok: true }>("/api/auth/logout", { method: "POST" });
}

export function apiUpdateProfile(updates: Partial<User>) {
  return request<{ user: User }>("/api/profile", {
    method: "PATCH",
    json: updates,
  });
}

export function apiEnroll(courseId: string) {
  return request<{ user: User }>("/api/enrollments", {
    method: "POST",
    json: { courseId },
  });
}

export function fetchProgress() {
  return request<{ progress: LearningProgress }>("/api/progress");
}

export function apiUpdateProgress(
  courseId: string,
  lessonId: string,
  action: "setCurrent" | "toggleCompleted",
) {
  return request<{ progress: LearningProgress }>("/api/progress", {
    method: "PUT",
    json: { courseId, lessonId, action },
  });
}

export function fetchCertificates() {
  return request<{ certificates: Certificate[] }>("/api/certificates");
}

export function apiIssueCertificate(courseId: string, score: number) {
  return request<{ certificate: Certificate }>("/api/certificates", {
    method: "POST",
    json: { courseId, score },
  });
}

export function fetchQuizResults() {
  return request<{ results: Record<string, QuizResult> }>("/api/quiz-attempts");
}

export function apiSaveQuizResult(courseId: string, result: QuizResult) {
  return request<{ result: QuizResult }>("/api/quiz-attempts", {
    method: "POST",
    json: {
      courseId,
      score: result.score,
      correctCount: result.correctCount,
      totalQuestions: result.totalQuestions,
    },
  });
}
