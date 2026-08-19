import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, getCurrentUserId } from "@/lib/session";
import type { User } from "@/types";

/**
 * Page guard. Redirects rather than rendering anything, so no admin markup is
 * ever sent to a non-admin — the check happens on the server before the
 * response is produced.
 */
export async function requireAdminPage(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/");
  return user;
}

/** Route/action guard. Returns the admin's id, or null when not authorised. */
export async function getAdminUserId(): Promise<string | null> {
  const userId = await getCurrentUserId();
  if (!userId) return null;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  return user?.role === "ADMIN" ? userId : null;
}

/** Throws inside a Server Action so the mutation cannot proceed unauthorised. */
export async function assertAdmin(): Promise<string> {
  const adminId = await getAdminUserId();
  if (!adminId) throw new Error("Forbidden: admin access required.");
  return adminId;
}
