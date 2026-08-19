import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ComponentType } from "react";
import {
  Award,
  BookOpen,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  FileText,
  Globe,
  GraduationCap,
  ListChecks,
  PlayCircle,
  Star,
  Users,
} from "lucide-react";
import { getTotalDurationMinutes, getTotalLessons } from "@/data/courses";
import {
  getAllCourses,
  getCourseById,
  getRelatedCourses,
} from "@/lib/courses";
import { getInstructorById } from "@/data/instructors";
import { getCategoryLabel } from "@/data/categories";
import { getReviewsForCourse } from "@/data/reviews";
import type { LessonType, Module } from "@/types";
import {
  formatDate,
  formatDuration,
  formatPrice,
  getDiscountPercent,
} from "@/lib/utils";
import {
  Badge,
  buttonVariants,
  Card,
} from "@/components/ui";
import { CourseCard } from "@/components/CourseCard";
import { CourseThumbnail } from "@/components/CourseThumbnail";
import { EnrollButton } from "@/components/EnrollButton";
import { SectionHeading } from "@/components/SectionHeading";
import { ShareCourseButton } from "@/components/ShareCourseButton";

interface CourseDetailsPageProps {
  params: Promise<{ courseId: string }>;
}

const lessonTypeIcons: Record<
  LessonType,
  ComponentType<{ className?: string }>
> = {
  video: PlayCircle,
  article: FileText,
  exercise: ListChecks,
};

function getModuleDurationMinutes(module: Module): number {
  return module.lessons.reduce(
    (total, lesson) => total + lesson.durationMinutes,
    0,
  );
}

export async function generateStaticParams() {
  const courses = await getAllCourses();
  return courses.map((course) => ({ courseId: course.id }));
}

export async function generateMetadata({
  params,
}: CourseDetailsPageProps): Promise<Metadata> {
  const { courseId } = await params;
  const course = await getCourseById(courseId);
  return {
    title: course?.title ?? "Course not found",
    description: course?.description,
  };
}

export default async function CourseDetailsPage({
  params,
}: CourseDetailsPageProps) {
  const { courseId } = await params;
  const course = await getCourseById(courseId);

  if (!course) notFound();

  const instructor = getInstructorById(course.instructorId);
  const courseReviews = getReviewsForCourse(course.id);
  const totalLessons = getTotalLessons(course);
  const totalMinutes = getTotalDurationMinutes(course);
  const discountPercent = getDiscountPercent(
    course.price,
    course.originalPrice,
  );
  const relatedCourses = await getRelatedCourses(course, 3);

  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: courseReviews.filter((review) => review.rating === star).length,
  }));

  const levelLabel =
    course.level.charAt(0).toUpperCase() + course.level.slice(1);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <Link
        href="/courses"
        className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
      >
        ← All courses
      </Link>

      {/* Thumbnail */}
      <div className="relative mt-6 aspect-video overflow-hidden rounded-2xl">
        <CourseThumbnail course={course} />
      </div>

      {/* Course information */}
      <header className="mt-8">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-500 dark:text-zinc-400">
          <Badge>{getCategoryLabel(course.category)}</Badge>
          <span className="uppercase tracking-wide">{course.level}</span>
          <span className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden />
            <span className="font-medium text-zinc-900 dark:text-zinc-50">
              {course.rating.toFixed(1)}
            </span>
            <span>({courseReviews.length} reviews)</span>
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" aria-hidden />
            {course.studentsCount.toLocaleString()} students
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" aria-hidden />
            {formatDuration(course.durationHours)}
          </span>
          <span>{totalLessons} lessons</span>
        </div>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
          {course.title}
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
          {course.description}
        </p>
        {course.tags.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {course.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                #{tag}
              </Badge>
            ))}
          </div>
        ) : null}
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_340px]">
        {/* Main column */}
        <div className="min-w-0 space-y-12">
          {/* Learning outcomes */}
          <section>
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              What you&apos;ll learn
            </h2>
            <Card className="mt-4 p-6">
              <ul className="grid gap-3 sm:grid-cols-2">
                {course.learningOutcomes.map((outcome) => (
                  <li
                    key={outcome}
                    className="flex items-start gap-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400"
                  >
                    <CheckCircle2
                      className="mt-1 h-4 w-4 shrink-0 text-emerald-500"
                      aria-hidden
                    />
                    {outcome}
                  </li>
                ))}
              </ul>
            </Card>
          </section>

          {/* Requirements */}
          <section>
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              Requirements
            </h2>
            <ul className="mt-4 space-y-2.5">
              {course.requirements.map((requirement) => (
                <li
                  key={requirement}
                  className="flex items-start gap-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400"
                >
                  <Check
                    className="mt-1 h-4 w-4 shrink-0 text-indigo-500"
                    aria-hidden
                  />
                  {requirement}
                </li>
              ))}
            </ul>
          </section>

          {/* Curriculum */}
          <section>
            <div className="flex flex-wrap items-end justify-between gap-2">
              <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                Curriculum
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {course.modules.length} modules · {totalLessons} lessons ·{" "}
                {formatDuration(totalMinutes / 60)} of content
              </p>
            </div>
            <div className="mt-4 space-y-3">
              {course.modules.map((module, moduleIndex) => {
                const moduleMinutes = getModuleDurationMinutes(module);
                return (
                  <Card key={module.id} className="overflow-hidden">
                    <details className="group">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5">
                        <div>
                          <p className="font-medium text-zinc-900 dark:text-zinc-50">
                            Module {moduleIndex + 1}: {module.title}
                          </p>
                          <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
                            {module.lessons.length} lessons ·{" "}
                            {formatDuration(moduleMinutes / 60)}
                          </p>
                        </div>
                        <ChevronDown
                          className="h-5 w-5 shrink-0 text-zinc-400 transition-transform group-open:rotate-180"
                          aria-hidden
                        />
                      </summary>
                      <ul className="px-5 pb-5">
                        {module.lessons.map((lesson, lessonIndex) => {
                          const Icon = lessonTypeIcons[lesson.type];
                          return (
                            <li
                              key={lesson.id}
                              className="flex items-center justify-between gap-4 border-t border-zinc-100 py-2.5 text-sm dark:border-zinc-800"
                            >
                              <span className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                                <Icon
                                  className="h-4 w-4 shrink-0 text-zinc-400"
                                  aria-hidden
                                />
                                {lessonIndex + 1}. {lesson.title}
                              </span>
                              <span className="shrink-0 text-zinc-400">
                                {lesson.durationMinutes} min
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </details>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* Instructor */}
          <section>
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              Your instructor
            </h2>
            {instructor ? (
              <Card className="mt-4 flex flex-wrap items-center gap-4 p-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-lg font-semibold text-white">
                  {instructor.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                    {instructor.name}
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {instructor.title}
                  </p>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                    {instructor.bio}
                  </p>
                </div>
                <dl className="flex gap-6 text-center text-sm">
                  <div>
                    <dd className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                      {instructor.studentsCount.toLocaleString()}
                    </dd>
                    <dt className="text-zinc-500 dark:text-zinc-400">
                      Students
                    </dt>
                  </div>
                  <div>
                    <dd className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                      {instructor.rating.toFixed(1)}
                    </dd>
                    <dt className="text-zinc-500 dark:text-zinc-400">Rating</dt>
                  </div>
                  <div>
                    <dd className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                      {instructor.coursesCount}
                    </dd>
                    <dt className="text-zinc-500 dark:text-zinc-400">
                      Courses
                    </dt>
                  </div>
                </dl>
              </Card>
            ) : null}
          </section>

          {/* Reviews */}
          <section>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                Reviews
              </h2>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                {courseReviews.length} review
                {courseReviews.length === 1 ? "" : "s"}
              </span>
            </div>

            {courseReviews.length > 0 ? (
              <Card className="mt-4 p-6">
                <div className="flex flex-wrap items-center gap-6">
                  <div className="text-center">
                    <p className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                      {course.rating.toFixed(1)}
                    </p>
                    <div className="mt-1 flex items-center justify-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          className={
                            index < Math.round(course.rating)
                              ? "h-4 w-4 fill-amber-400 text-amber-400"
                              : "h-4 w-4 text-zinc-300 dark:text-zinc-700"
                          }
                          aria-hidden
                        />
                      ))}
                    </div>
                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                      {courseReviews.length} reviews
                    </p>
                  </div>
                  <div className="min-w-0 flex-1 space-y-1.5">
                    {ratingCounts.map(({ star, count }) => (
                      <div
                        key={star}
                        className="flex items-center gap-2 text-sm"
                      >
                        <span className="w-10 shrink-0 text-zinc-500 dark:text-zinc-400">
                          {star} star
                        </span>
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                          <div
                            className="h-full rounded-full bg-amber-400"
                            style={{
                              width: `${(count / courseReviews.length) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="w-6 shrink-0 text-right text-zinc-400">
                          {count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ) : null}

            <div className="mt-6 space-y-4">
              {courseReviews.map((review) => (
                <Card key={review.id} className="p-6">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-sm font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                        {review.authorName.charAt(0)}
                      </div>
                      <span className="font-medium text-zinc-900 dark:text-zinc-50">
                        {review.authorName}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          className={
                            index < review.rating
                              ? "h-4 w-4 fill-amber-400 text-amber-400"
                              : "h-4 w-4 text-zinc-300 dark:text-zinc-700"
                          }
                          aria-hidden
                        />
                      ))}
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                    {review.comment}
                  </p>
                  <p className="mt-3 text-xs text-zinc-400">
                    {formatDate(review.createdAt)}
                  </p>
                </Card>
              ))}
            </div>

            {courseReviews.length === 0 ? (
              <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
                No reviews yet — be the first to share your experience.
              </p>
            ) : null}
          </section>
        </div>

        {/* Pricing sidebar */}
        <aside>
          <div className="space-y-4 lg:sticky lg:top-24">
            <Card className="p-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                  {course.price === 0 ? "Free" : formatPrice(course.price)}
                </span>
                {discountPercent > 0 ? (
                  <>
                    <span className="text-base text-zinc-400 line-through">
                      {formatPrice(course.originalPrice ?? course.price)}
                    </span>
                    <Badge variant="success">{discountPercent}% off</Badge>
                  </>
                ) : null}
              </div>

              <div className="mt-5 space-y-3">
                <EnrollButton courseId={course.id} />
                {course.quiz ? (
                  <Link
                    href={`/quiz/${course.id}`}
                    className={buttonVariants({
                      variant: "outline",
                      className: "w-full",
                    })}
                  >
                    Take the quiz
                  </Link>
                ) : null}
                <ShareCourseButton
                  courseTitle={course.title}
                  className="w-full"
                />
              </div>

              <dl className="mt-6 space-y-3 border-t border-zinc-100 pt-6 text-sm dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <dt className="sr-only">Duration</dt>
                  <Clock
                    className="h-4 w-4 shrink-0 text-zinc-400"
                    aria-hidden
                  />
                  <dd className="text-zinc-600 dark:text-zinc-400">
                    {formatDuration(course.durationHours)} of video
                  </dd>
                </div>
                <div className="flex items-center gap-2">
                  <dt className="sr-only">Lessons</dt>
                  <BookOpen
                    className="h-4 w-4 shrink-0 text-zinc-400"
                    aria-hidden
                  />
                  <dd className="text-zinc-600 dark:text-zinc-400">
                    {totalLessons} lessons
                  </dd>
                </div>
                <div className="flex items-center gap-2">
                  <dt className="sr-only">Level</dt>
                  <GraduationCap
                    className="h-4 w-4 shrink-0 text-zinc-400"
                    aria-hidden
                  />
                  <dd className="text-zinc-600 dark:text-zinc-400">
                    {levelLabel}
                  </dd>
                </div>
                <div className="flex items-center gap-2">
                  <dt className="sr-only">Language</dt>
                  <Globe
                    className="h-4 w-4 shrink-0 text-zinc-400"
                    aria-hidden
                  />
                  <dd className="text-zinc-600 dark:text-zinc-400">
                    {course.language}
                  </dd>
                </div>
                <div className="flex items-center gap-2">
                  <dt className="sr-only">Students</dt>
                  <Users
                    className="h-4 w-4 shrink-0 text-zinc-400"
                    aria-hidden
                  />
                  <dd className="text-zinc-600 dark:text-zinc-400">
                    {course.studentsCount.toLocaleString()} students
                  </dd>
                </div>
                <div className="flex items-center gap-2">
                  <dt className="sr-only">Last updated</dt>
                  <Calendar
                    className="h-4 w-4 shrink-0 text-zinc-400"
                    aria-hidden
                  />
                  <dd className="text-zinc-600 dark:text-zinc-400">
                    Updated {formatDate(course.updatedAt)}
                  </dd>
                </div>
                <div className="flex items-center gap-2">
                  <dt className="sr-only">Certificate</dt>
                  <Award
                    className="h-4 w-4 shrink-0 text-zinc-400"
                    aria-hidden
                  />
                  <dd className="text-zinc-600 dark:text-zinc-400">
                    Certificate on completion
                  </dd>
                </div>
              </dl>
            </Card>
          </div>
        </aside>
      </div>

      {/* Related courses */}
      <section className="mt-16">
        <SectionHeading
          eyebrow="Keep learning"
          title="Related courses"
          description={`Explore more courses in ${getCategoryLabel(course.category)} and beyond.`}
        />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {relatedCourses.map((related) => (
            <CourseCard key={related.id} course={related} />
          ))}
        </div>
      </section>
    </div>
  );
}
