This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Database setup

LearnHub stores users, courses and learner activity in PostgreSQL via Prisma.

```bash
# 1. Start Postgres (any instance works; this is the quickest)
docker run --name learnhub-postgres   -e POSTGRES_USER=learnhub -e POSTGRES_PASSWORD=learnhub -e POSTGRES_DB=learnhub   -p 5432:5432 -d postgres:17-alpine

# 2. Point the app at it
cp .env.example .env      # then edit DATABASE_URL if your credentials differ

# 3. Create the schema and load the course catalog
npm run db:migrate
npm run db:seed
```

| Script | Purpose |
| --- | --- |
| `npm run db:migrate` | Create/apply migrations (`prisma migrate dev`) |
| `npm run db:seed` | Load the course catalog from `data/courses.ts` (idempotent) |
| `npm run db:studio` | Browse the data in Prisma Studio |

The connection string lives in `prisma.config.ts` rather than `schema.prisma`
— Prisma 7 removed `url` from the datasource block.

`data/courses.ts` is now the **seed source only**. Runtime reads go through
`lib/courses.ts`; re-run `npm run db:seed` after editing the catalog.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
