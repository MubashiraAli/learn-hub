import Link from "next/link";
import { ArrowRight, Award, BookOpen, GraduationCap, PlayCircle, Quote, Star } from "lucide-react";
import {
  getAllCourses,
  getCatalogStats,
  getCourseCountsByCategory,
} from "@/lib/courses";
import { instructors } from "@/data/instructors";
import { courseCategories } from "@/data/categories";
import { reviews } from "@/data/reviews";
import { CourseCard } from "@/components/CourseCard";
import { CategoryCard } from "@/components/CategoryCard";
import { InstructorCard } from "@/components/InstructorCard";
import { HeroSearch } from "@/components/HeroSearch";
import { SectionHeading } from "@/components/SectionHeading";
import {
  Badge,
  Card,
  buttonVariants,
} from "@/components/ui";

export default async function Home() {
  const [courses, catalog, categoryCounts] = await Promise.all([
    getAllCourses(),
    getCatalogStats(),
    getCourseCountsByCategory(),
  ]);

  const totalStudents = catalog.studentTotal;
  const totalLessons = catalog.lessonTotal;

  const stats = [
    { label: "Courses", value: catalog.courseCount },
    { label: "Instructors", value: instructors.length },
    { label: "Students", value: totalStudents.toLocaleString() },
    { label: "Lessons", value: totalLessons.toLocaleString() },
  ];

  const featuredCourses = [...courses]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);
  const featuredInstructors = instructors.slice(0, 4);
  const testimonials = reviews.filter((review) => review.rating === 5).slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-zinc-200 bg-gradient-to-b from-indigo-50/60 to-white dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-950">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center animate-fade-in-up motion-reduce:animate-none sm:px-6 sm:py-28">
          <Badge variant="secondary" className="mb-6">
            {catalog.courseCount} courses · {courseCategories.length} categories
          </Badge>
          <h1 className="mx-auto max-w-3xl text-4xl font-semibold tracking-tight text-zinc-900 sm:text-6xl dark:text-zinc-50">
            Learn the skills that move your{" "}
            <span className="text-indigo-600 dark:text-indigo-400">
              career forward
            </span>
            .
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Master web development, AI, data science, cyber security, design,
            and cloud — through courses, quizzes, and certificates.
          </p>
          <div className="mt-10">
            <HeroSearch />
          </div>
          <p className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-zinc-500 dark:text-zinc-400">
            <span className="flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              4.8 average course rating
            </span>
            <span className="flex items-center gap-1.5">
              <GraduationCap className="h-4 w-4" />
              {totalStudents.toLocaleString()}+ learners
            </span>
            <span className="flex items-center gap-1.5">
              <Award className="h-4 w-4" />
              Certificate on completion
            </span>
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <SectionHeading
          eyebrow="Explore"
          title="Browse by category"
          description="Pick a path and start learning today."
        />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courseCategories.map((info) => (
            <CategoryCard
              key={info.id}
              category={info.id}
              count={categoryCounts[info.id] ?? 0}
            />
          ))}
        </div>
      </section>

      {/* Featured courses */}
      <section className="border-y border-zinc-200 bg-zinc-50/60 dark:border-zinc-800 dark:bg-zinc-900/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Featured"
              title="Top-rated courses"
              description="Hand-picked favorites from our catalog."
            />
            <Link
              href="/courses"
              className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
            >
              View all courses
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* Instructors */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <SectionHeading
          eyebrow="Mentors"
          title="Learn from industry experts"
          description="Instructors who have shipped real products at scale."
        />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredInstructors.map((instructor) => (
            <InstructorCard key={instructor.id} instructor={instructor} />
          ))}
        </div>
      </section>

      {/* Statistics */}
      <section className="bg-zinc-900 dark:bg-black">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <dl className="grid grid-cols-2 gap-8 text-center lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dd className="text-3xl font-semibold text-white sm:text-4xl">
                  {stat.value}
                </dd>
                <dt className="mt-2 text-sm text-zinc-400">{stat.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <SectionHeading
          eyebrow="Testimonials"
          title="Loved by learners"
          description="Real words from real students."
        />
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="flex flex-col p-6">
              <Quote className="h-6 w-6 text-indigo-500" aria-hidden />
              <p className="mt-4 flex-1 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
                “{testimonial.comment}”
              </p>
              <div className="mt-5 flex items-center gap-3 border-t border-zinc-100 pt-5 dark:border-zinc-800">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-sm font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                  {testimonial.authorName.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    {testimonial.authorName}
                  </p>
                  <div className="mt-0.5 flex items-center gap-0.5">
                    {Array.from({ length: testimonial.rating }).map((_, index) => (
                      <Star
                        key={index}
                        className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                        aria-hidden
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-16 text-center sm:px-12">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Ready to start learning?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-indigo-100">
            Join thousands of learners building real skills, one lesson at a
            time. Start free and earn a certificate when you finish.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/courses"
              className={buttonVariants({
                size: "lg",
                className:
                  "bg-white text-indigo-700 hover:bg-indigo-50 focus-visible:ring-white",
              })}
            >
              <BookOpen className="h-4 w-4" />
              Browse courses
            </Link>
            <Link
              href="/my-learning"
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className:
                  "border-white/40 text-white hover:bg-white/10 hover:text-white focus-visible:ring-white",
              })}
            >
              <PlayCircle className="h-4 w-4" />
              Continue learning
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
