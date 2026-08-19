import { BookOpen, Star, Users } from "lucide-react";
import type { Instructor } from "@/types";
import { getCategoryLabel } from "@/data/categories";
import { Card } from "@/components/ui";

export function InstructorCard({ instructor }: { instructor: Instructor }) {
  return (
    <Card className="flex h-full flex-col items-center p-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-2xl font-semibold text-white">
        {instructor.name.charAt(0)}
      </div>
      <h3 className="mt-4 text-base font-semibold text-zinc-900 dark:text-zinc-50">
        {instructor.name}
      </h3>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        {instructor.title}
      </p>
      <p className="mt-3 text-xs font-medium uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
        {getCategoryLabel(instructor.category)}
      </p>
      <dl className="mt-5 flex w-full items-center justify-center gap-5 border-t border-zinc-100 pt-4 text-sm dark:border-zinc-800">
        <div className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400">
          <dt className="sr-only">Rating</dt>
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden />
          <dd>{instructor.rating.toFixed(1)}</dd>
        </div>
        <div className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400">
          <dt className="sr-only">Students</dt>
          <Users className="h-3.5 w-3.5" aria-hidden />
          <dd>{instructor.studentsCount.toLocaleString()}</dd>
        </div>
        <div className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400">
          <dt className="sr-only">Courses</dt>
          <BookOpen className="h-3.5 w-3.5" aria-hidden />
          <dd>{instructor.coursesCount}</dd>
        </div>
      </dl>
    </Card>
  );
}
