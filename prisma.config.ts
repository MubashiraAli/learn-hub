import { defineConfig } from "@prisma/config";

// Prisma 7 no longer reads `.env` automatically and no longer accepts `url`
// inside the datasource block — the connection string lives here instead.
// Load .env when running locally. Hosted builds (Vercel, Railway, CI) inject
// environment variables directly and have no .env file, so a missing file is
// expected rather than an error.
try {
  process.loadEnvFile?.(".env");
} catch {
  // no .env on disk — fall through to the real environment
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // Read directly rather than via Prisma's env() helper, which throws when
    // the variable is absent. `prisma generate` needs no database connection
    // and runs during `npm install` on hosted builds; only migrate/seed do,
    // and those fail with a clear error if this is empty.
    url: process.env.DATABASE_URL ?? "",
  },
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
});
