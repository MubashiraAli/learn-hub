import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { SearchX } from "lucide-react";
import { getCatalogStats, searchCourses } from "@/lib/courses";
import { courseCategories } from "@/data/categories";
import type { Course, CourseCategory, CourseLevel } from "@/types";
import { CourseCard } from "@/components/CourseCard";
import { CourseFilters } from "@/components/CourseFilters";
import { SectionHeading } from "@/components/SectionHeading";
import { EmptyState, buttonVariants } from "@/components/ui";

export const metadata: Metadata = {
  title: "Courses",
};

const categories = courseCategories.map((info) => info.id);

const levels: CourseLevel[] = ["beginner", "intermediate", "advanced"];
const ratingValues = ["4.7", "4.9"];
const priceFilterValues = ["free", "lt100", "lt150"];
const sortKeys = ["popular", "rating", "price-asc", "price-desc", "duration"];

function parseLevel(value: unknown): CourseLevel | undefined {
  return typeof value === "string" && levels.includes(value as CourseLevel)
    ? (value as CourseLevel)
    : undefined;
}

function parseRating(value: unknown): number {
  const rating =
    typeof value === "string" && ratingValues.includes(value)
      ? parseFloat(value)
      : NaN;
  return Number.isNaN(rating) ? 0 : rating;
}

function parsePriceFilter(value: unknown): string | undefined {
  return typeof value === "string" && priceFilterValues.includes(value)
    ? value
    : undefined;
}

function parseSort(value: unknown): string {
  return typeof value === "string" && sortKeys.includes(value)
    ? value
    : "popular";
}

function sortCourses(list: Course[], sort: string): Course[] {
  const sorted = [...list];
  switch (sort) {
    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating);
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "duration":
      return sorted.sort((a, b) => a.durationHours - b.durationHours);
    default:
      return sorted.sort((a, b) => b.studentsCount - a.studentsCount);
  }
}

export default async function CoursesPage({
  searchParams,
}: PageProps<"/courses">) {
  const params = await searchParams;

  const searchQuery = typeof params.search === "string" ? params.search : "";
  const activeCategory =
    typeof params.category === "string" &&
    categories.includes(params.category as CourseCategory)
      ? (params.category as CourseCategory)
      : undefined;
  const activeLevel = parseLevel(params.level);
  const minRating = parseRating(params.rating);
  const priceFilter = parsePriceFilter(params.price);
  const sort = parseSort(params.sort);

  const [allMatches, { courseCount }] = await Promise.all([
    searchCourses(searchQuery),
    getCatalogStats(),
  ]);
  let result = allMatches;

  if (activeCategory) {
    result = result.filter((course) => course.category === activeCategory);
  }
  if (activeLevel) {
    result = result.filter((course) => course.level === activeLevel);
  }
  if (minRating > 0) {
    result = result.filter((course) => course.rating >= minRating);
  }
  if (priceFilter === "free") {
    result = result.filter((course) => course.price === 0);
  }
  if (priceFilter === "lt100") {
    result = result.filter((course) => course.price < 100);
  }
  if (priceFilter === "lt150") {
    result = result.filter((course) => course.price < 150);
  }

  result = sortCourses(result, sort);

  const activeFilterCount = [
    searchQuery,
    activeCategory,
    activeLevel,
    minRating > 0 ? params.rating : "",
    priceFilter,
  ].filter(Boolean).length;

  const headingTitle = searchQuery
    ? `Results for "${searchQuery}"`
    : "All courses";

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <SectionHeading
        eyebrow="Catalog"
        title={headingTitle}
        description="Search, filter, and sort the catalog to find the right course for you."
      />

      <Suspense fallback={null}>
        <CourseFilters categories={categories} />
      </Suspense>

      <div className="mt-8">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Showing {result.length} of {courseCount} course
          {courseCount === 1 ? "" : "s"}
          {activeFilterCount > 0
            ? ` · ${activeFilterCount} active filter${activeFilterCount === 1 ? "" : "s"}`
            : ""}
        </p>
      </div>

      <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {result.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      {result.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={<SearchX className="h-6 w-6" />}
            title="No courses found"
            description={
              searchQuery
                ? `Nothing matches "${searchQuery}". Try a different keyword or clear your filters.`
                : "No courses match the selected filters. Try broadening your search."
            }
            action={
              <Link
                href="/courses"
                className={buttonVariants({ variant: "outline" })}
              >
                Clear all filters
              </Link>
            }
          />
        </div>
      ) : null}
    </div>
  );
}
