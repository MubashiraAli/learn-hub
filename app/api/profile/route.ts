import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/session";
import { toUserDTO } from "@/lib/dto";
import {
  isValidEmail,
  jsonError,
  normalizeEmail,
  optionalString,
  readJson,
  unauthorized,
} from "@/lib/api";

export async function PATCH(request: Request) {
  const userId = await getCurrentUserId();
  if (!userId) return unauthorized();

  const body = await readJson(request);
  if (!body) return jsonError("Invalid request body.", 400);

  const data: Record<string, unknown> = {};

  const name = optionalString(body.name);
  if (name !== undefined) {
    if (!name) return jsonError("Please enter your name.", 400);
    data.name = name;
  }

  if (body.email !== undefined) {
    const email = normalizeEmail(body.email);
    if (!isValidEmail(email)) {
      return jsonError("Please enter a valid email address.", 400);
    }
    const clash = await prisma.user.findFirst({
      where: { email, NOT: { id: userId } },
      select: { id: true },
    });
    if (clash) return jsonError("That email is already in use.", 409);
    data.email = email;
  }

  for (const field of [
    "title",
    "phone",
    "address",
    "city",
    "state",
    "country",
    "bio",
    "avatarUrl",
  ] as const) {
    const value = optionalString(body[field]);
    if (value !== undefined) data[field] = value;
  }

  if (body.skills !== undefined) {
    if (!Array.isArray(body.skills)) {
      return jsonError("Skills must be a list.", 400);
    }
    data.skills = Array.from(
      new Set(
        body.skills
          .filter((s): s is string => typeof s === "string")
          .map((s) => s.trim())
          .filter(Boolean),
      ),
    );
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data,
    include: { enrollments: { select: { courseId: true } } },
  });

  return NextResponse.json({ user: toUserDTO(user) });
}
