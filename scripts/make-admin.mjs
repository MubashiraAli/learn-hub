#!/usr/bin/env node
/**
 * Promotes a user to ADMIN (or back to USER).
 *
 *   node scripts/make-admin.mjs someone@example.com
 *   node scripts/make-admin.mjs someone@example.com USER
 */
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

process.loadEnvFile?.(".env");

const [email, role = "ADMIN"] = process.argv.slice(2);
if (!email) {
  console.error("Usage: node scripts/make-admin.mjs <email> [ADMIN|USER]");
  process.exit(1);
}
if (role !== "ADMIN" && role !== "USER") {
  console.error("Role must be ADMIN or USER.");
  process.exit(1);
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

try {
  const user = await prisma.user.update({
    where: { email: email.toLowerCase() },
    data: { role },
    select: { name: true, email: true, role: true },
  });
  console.log(`${user.name} <${user.email}> is now ${user.role}`);
} catch {
  console.error(`No user found with email ${email}`);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
