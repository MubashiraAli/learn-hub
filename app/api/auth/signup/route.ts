import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { createSession } from "@/lib/session";
import { toUserDTO } from "@/lib/dto";
import { isValidEmail, jsonError, normalizeEmail, readJson } from "@/lib/api";

export async function POST(request: Request) {
  const body = await readJson(request);
  if (!body) return jsonError("Invalid request body.", 400);

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = normalizeEmail(body.email);
  const password = typeof body.password === "string" ? body.password : "";

  if (name.length < 2) return jsonError("Name must be at least 2 characters.", 400);
  if (!isValidEmail(email)) return jsonError("Enter a valid email address.", 400);
  if (password.length < 6) {
    return jsonError("Password must be at least 6 characters.", 400);
  }

  const existing = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });
  if (existing) {
    return jsonError("An account with this email already exists.", 409);
  }

  const user = await prisma.user.create({
    data: { name, email, passwordHash: await hashPassword(password) },
    include: { enrollments: { select: { courseId: true } } },
  });

  await createSession(user.id);

  return NextResponse.json({ user: toUserDTO(user) }, { status: 201 });
}
