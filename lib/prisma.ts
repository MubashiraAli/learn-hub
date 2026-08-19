import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Prisma 7 talks to Postgres through a driver adapter rather than a bundled
// query engine, so the connection string is supplied here instead of in
// schema.prisma.
function createClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Copy .env.example to .env and point it at your Postgres instance.",
    );
  }
  return new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  });
}

// Next.js hot-reloads modules in development; without a global cache every
// reload would open a new pool and exhaust Postgres connections.
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma: PrismaClient = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
