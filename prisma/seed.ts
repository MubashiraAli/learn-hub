/**
 * Seeds the course catalog from the original static data in `data/courses.ts`,
 * including the AWS Cloud Practitioner course, its modules, lessons, quiz and
 * questions.
 *
 *   npm run db:seed
 *
 * Every write is an upsert keyed on the natural slug, so re-running the seed
 * refreshes the catalog without touching user accounts, enrollments, progress
 * or certificates.
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { courses } from "../data/courses";

process.loadEnvFile?.(".env");

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set — cannot seed.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function main() {
  console.log(`Seeding ${courses.length} courses...`);

  for (const course of courses) {
    await prisma.course.upsert({
      where: { id: course.id },
      create: {
        id: course.id,
        title: course.title,
        description: course.description,
        category: course.category,
        level: course.level,
        instructorId: course.instructorId,
        durationHours: course.durationHours,
        rating: course.rating,
        studentsCount: course.studentsCount,
        price: course.price,
        originalPrice: course.originalPrice ?? null,
        language: course.language,
        tags: course.tags,
        learningOutcomes: course.learningOutcomes,
        requirements: course.requirements,
        imageUrl: course.imageUrl ?? null,
        updatedAt: new Date(course.updatedAt),
      },
      update: {
        title: course.title,
        description: course.description,
        category: course.category,
        level: course.level,
        instructorId: course.instructorId,
        durationHours: course.durationHours,
        rating: course.rating,
        studentsCount: course.studentsCount,
        price: course.price,
        originalPrice: course.originalPrice ?? null,
        language: course.language,
        tags: course.tags,
        learningOutcomes: course.learningOutcomes,
        requirements: course.requirements,
        imageUrl: course.imageUrl ?? null,
        updatedAt: new Date(course.updatedAt),
      },
    });

    for (const [moduleIndex, module] of course.modules.entries()) {
      const moduleRow = await prisma.module.upsert({
        where: {
          courseId_slug: { courseId: course.id, slug: module.id },
        },
        create: {
          slug: module.id,
          title: module.title,
          position: moduleIndex,
          courseId: course.id,
        },
        update: {
          title: module.title,
          position: moduleIndex,
        },
      });

      for (const [lessonIndex, lesson] of module.lessons.entries()) {
        const lessonRow = await prisma.lesson.upsert({
          where: {
            moduleId_slug: { moduleId: moduleRow.id, slug: lesson.id },
          },
          create: {
            slug: lesson.id,
            title: lesson.title,
            description: lesson.description,
            type: lesson.type,
            durationMinutes: lesson.durationMinutes,
            position: lessonIndex,
            moduleId: moduleRow.id,
          },
          update: {
            title: lesson.title,
            description: lesson.description,
            type: lesson.type,
            durationMinutes: lesson.durationMinutes,
            position: lessonIndex,
          },
        });

        for (const [resourceIndex, resource] of lesson.resources.entries()) {
          await prisma.lessonResource.upsert({
            where: {
              lessonId_slug: { lessonId: lessonRow.id, slug: resource.id },
            },
            create: {
              slug: resource.id,
              title: resource.title,
              url: resource.url,
              kind: resource.kind,
              position: resourceIndex,
              lessonId: lessonRow.id,
            },
            update: {
              title: resource.title,
              url: resource.url,
              kind: resource.kind,
              position: resourceIndex,
            },
          });
        }
      }
    }

    if (course.quiz) {
      const quizRow = await prisma.quiz.upsert({
        where: { courseId: course.id },
        create: {
          slug: course.quiz.id,
          courseId: course.id,
          title: course.quiz.title,
          passScore: course.quiz.passScore,
        },
        update: {
          slug: course.quiz.id,
          title: course.quiz.title,
          passScore: course.quiz.passScore,
        },
      });

      for (const [questionIndex, question] of course.quiz.questions.entries()) {
        await prisma.question.upsert({
          where: {
            quizId_slug: { quizId: quizRow.id, slug: question.id },
          },
          create: {
            slug: question.id,
            prompt: question.question,
            options: question.options,
            correctIndex: question.correctIndex,
            position: questionIndex,
            quizId: quizRow.id,
          },
          update: {
            prompt: question.question,
            options: question.options,
            correctIndex: question.correctIndex,
            position: questionIndex,
          },
        });
      }
    }
  }

  const [courseCount, moduleCount, lessonCount, quizCount, questionCount] =
    await Promise.all([
      prisma.course.count(),
      prisma.module.count(),
      prisma.lesson.count(),
      prisma.quiz.count(),
      prisma.question.count(),
    ]);

  console.log(
    `Done. ${courseCount} courses, ${moduleCount} modules, ${lessonCount} lessons, ${quizCount} quizzes, ${questionCount} questions.`,
  );

  const aws = await prisma.course.findUnique({
    where: { id: "aws-cloud-practitioner" },
    include: { modules: { include: { lessons: true } }, quiz: true },
  });
  if (!aws) {
    throw new Error("AWS Cloud Practitioner course was not seeded.");
  }
  console.log(
    `AWS Cloud Practitioner: ${aws.modules.length} modules, ` +
      `${aws.modules.reduce((n, m) => n + m.lessons.length, 0)} lessons, ` +
      `quiz "${aws.quiz?.title ?? "none"}".`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
