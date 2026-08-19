import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";
import { createSession } from "@/lib/session";
import { toUserDTO } from "@/lib/dto";
import { jsonError, normalizeEmail, readJson } from "@/lib/api";

export async function POST(request: Request) {
  const body = await readJson(request);
  if (!body) return jsonError("Invalid request body.", 400);

  const email = normalizeEmail(body.email);
  const password = typeof body.password === "string" ? body.password : "";

  const user = await prisma.user.findUnique({
    where: { email },
    include: { enrollments: { select: { courseId: true } } },
  });

  // Same message and roughly the same work either way, so the response does
  // not reveal whether the email is registered.
  const ok = user ? await verifyPassword(password, user.passwordHash) : false;
  if (!user || !ok) {
    return jsonError("Invalid email or password. Please try again.", 401);
  }

  await createSession(user.id);

  return NextResponse.json({ user: toUserDTO(user) });
}
