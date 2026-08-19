import { NextResponse } from "next/server";

export function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export const unauthorized = () => jsonError("Not signed in.", 401);

export function normalizeEmail(value: unknown): string {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/** Reads a JSON body, returning null instead of throwing on malformed input. */
export async function readJson(
  request: Request,
): Promise<Record<string, unknown> | null> {
  try {
    const body = await request.json();
    return body && typeof body === "object"
      ? (body as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
}

/** Trims a string field, returning undefined when absent so PATCH stays partial. */
export function optionalString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  return value.trim();
}
