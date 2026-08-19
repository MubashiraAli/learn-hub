import { defineConfig, env } from "@prisma/config";

// Prisma 7 no longer reads `.env` automatically and no longer accepts `url`
// inside the datasource block — the connection string lives here instead.
process.loadEnvFile?.(".env");

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"),
  },
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
});
