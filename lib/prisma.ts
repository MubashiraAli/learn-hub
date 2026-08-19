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

// Cached on globalThis so Next.js hot reloads in development reuse one pool
// instead of opening a new one per reload, and so warm serverless instances
// reuse their client across invocations.
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function getClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createClient();
  }
  return globalForPrisma.prisma;
}

/**
 * Connects lazily: the client is built on first use, not on import.
 *
 * `next build` imports every route to collect its configuration. Constructing
 * eagerly meant a build with no DATABASE_URL — which is the normal state on a
 * hosted builder before env vars are read, and on any CI that only type-checks
 * — died at import time. Deferring means a missing connection string surfaces
 * as a runtime error on the request that actually needs the database, with the
 * same message as before.
 */
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, property, receiver) {
    const client = getClient();
    const value = Reflect.get(client, property, receiver);
    return typeof value === "function" ? value.bind(client) : value;
  },
  has(_target, property) {
    return property in getClient();
  },
});
