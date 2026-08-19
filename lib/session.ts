import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import type { User } from "@/types";
import { toUserDTO, type UserRow } from "@/lib/dto";

export const SESSION_COOKIE = "learnhub_session";

/** Sessions last 30 days and are refreshed on every authenticated request. */
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

function expiryFromNow(): Date {
  return new Date(Date.now() + SESSION_TTL_MS);
}

/** Creates a session row and sets the httpOnly cookie. */
export async function createSession(userId: string): Promise<void> {
  const token = randomBytes(32).toString("hex");
  const expiresAt = expiryFromNow();

  await prisma.session.create({
    data: { token, userId, expiresAt },
  });

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

/** Deletes the current session row and clears the cookie. */
export async function destroySession(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;

  if (token) {
    // deleteMany rather than delete: a stale cookie must not throw.
    await prisma.session.deleteMany({ where: { token } });
  }
  store.delete(SESSION_COOKIE);
}

/**
 * Resolves the signed-in user from the session cookie, or null.
 * Expired sessions are deleted as they are encountered.
 */
export async function getCurrentUser(): Promise<User | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { token },
    include: {
      user: {
        include: { enrollments: { select: { courseId: true } } },
      },
    },
  });

  if (!session) return null;

  if (session.expiresAt.getTime() < Date.now()) {
    await prisma.session.deleteMany({ where: { token } });
    return null;
  }

  return toUserDTO(session.user as UserRow);
}

/** The user id only — avoids loading relations when just authorising. */
export async function getCurrentUserId(): Promise<string | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { token },
    select: { userId: true, expiresAt: true },
  });

  if (!session) return null;
  if (session.expiresAt.getTime() < Date.now()) {
    await prisma.session.deleteMany({ where: { token } });
    return null;
  }
  return session.userId;
}

/** Removes sessions that have already expired. Safe to call opportunistically. */
export async function pruneExpiredSessions(): Promise<void> {
  await prisma.session.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  });
}
