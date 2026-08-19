import Link from "next/link";
import {
  ArrowRight,
  Clock,
  Star,
  Users,
} from "lucide-react";
import type { Course } from "@/types";
import { getInstructorById } from "@/data/instructors";
import { getCategoryLabel } from "@/data/categories";
import {
  cn,
  formatDuration,
  formatPrice,
  getDiscountPercent,
} from "@/lib/utils";
import { Badge, Card, CardContent, buttonVariants } from "@/components/ui";
import { CourseThumbnail } from "@/components/CourseThumbnail";

export function CourseCard({ course }: { course: Course }) {
  const instructor = getInstructorById(course.instructorId);
  const discountPercent = getDiscountPercent(
    course.price,
    course.originalPrice,
  );
  const courseUrl = `/courses/${course.id}`;

  return (
    <Card className="group flex h-full flex-col overflow-hidden transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-md motion-reduce:transform-none">
      <Link
        href={courseUrl}
        aria-hidden
        tabIndex={-1}
        className="relative block aspect-video overflow-hidden"
      >
        <CourseThumbnail
          course={course}
          className="transition-transform duration-300 group-hover:scale-105"
        />
      </Link>

      <CardContent className="flex flex-1 flex-col p-5 pt-0">
        <div className="mb-3 flex items-center justify-between gap-2">
          <Badge>{getCategoryLabel(course.category)}</Badge>
          <span className="text-xs uppercase tracking-wide text-zinc-400">
            {course.level}
          </span>
        </div>

        <Link
          href={courseUrl}
          className="line-clamp-2 text-lg font-semibold leading-snug tracking-tight text-zinc-900 transition-colors hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-zinc-50 dark:focus-visible:ring-offset-zinc-950 dark:hover:text-indigo-400"
        >
          {course.title}
        </Link>

        <div className="mt-3 flex items-center gap-2">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-semibold text-white">
            {instructor?.name.charAt(0) ?? "?"}
          </div>
          <span className="truncate text-sm text-zinc-500 dark:text-zinc-400">
            {instructor?.name ?? "Instructor"}
          </span>
        </div>

        <dl className="mt-4 flex items-center gap-4 border-t border-zinc-100 pt-4 text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
          <div className="flex items-center gap-1">
            <dt className="sr-only">Rating</dt>
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden />
            <dd className="font-medium text-zinc-900 dark:text-zinc-50">
              {course.rating.toFixed(1)}
            </dd>
          </div>
          <div className="flex items-center gap-1">
            <dt className="sr-only">Students</dt>
            <Users className="h-3.5 w-3.5" aria-hidden />
            <dd>{course.studentsCount.toLocaleString()}</dd>
          </div>
          <div className="flex items-center gap-1">
            <dt className="sr-only">Duration</dt>
            <Clock className="h-3.5 w-3.5" aria-hidden />
            <dd>{formatDuration(course.durationHours)}</dd>
          </div>
        </dl>

        <div className="mt-4 flex flex-1 flex-col justify-end">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                {course.price === 0 ? "Free" : formatPrice(course.price)}
              </span>
              {discountPercent > 0 ? (
                <span className="text-sm text-zinc-400 line-through dark:text-zinc-500">
                  {formatPrice(course.originalPrice ?? course.price)}
                </span>
              ) : null}
            </div>
            {discountPercent > 0 ? (
              <Badge variant="success">{discountPercent}% off</Badge>
            ) : null}
          </div>

          <Link
            href={courseUrl}
            className={cn(
              buttonVariants({
                size: "sm",
                className: "mt-4 w-full",
              }),
            )}
          >
            View Course
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transform-none"
              aria-hidden
            />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
