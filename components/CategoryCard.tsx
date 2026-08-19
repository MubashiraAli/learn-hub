import Link from "next/link";
import { ArrowRight, BarChart3, BrainCircuit, Cloud, Code2, Palette, ShieldCheck, type LucideIcon } from "lucide-react";
import type { CourseCategory } from "@/types";
import { getCategoryInfo } from "@/data/categories";
import { Card } from "@/components/ui";

const categoryIcons: Record<CourseCategory, LucideIcon> = {
  "web-development": Code2,
  ai: BrainCircuit,
  "data-science": BarChart3,
  "cyber-security": ShieldCheck,
  "ui-ux": Palette,
  cloud: Cloud,
};

export function CategoryCard({
  category,
  count,
}: {
  category: CourseCategory;
  count: number;
}) {
  const info = getCategoryInfo(category);
  const Icon = categoryIcons[category];

  return (
    <Link
      href={`/courses?category=${category}`}
      className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-950"
    >
      <Card className="h-full p-6 transition-[box-shadow,transform] duration-200 group-hover:-translate-y-0.5 group-hover:shadow-md motion-reduce:transform-none">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white dark:bg-indigo-950 dark:text-indigo-300">
          <Icon className="h-5 w-5" aria-hidden />
        </div>
        <h3 className="mt-4 text-base font-semibold text-zinc-900 dark:text-zinc-50">
          {info.label}
        </h3>
        <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          {info.description}
        </p>
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-indigo-600 dark:text-indigo-400">
          {count} courses
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transform-none" />
        </span>
      </Card>
    </Link>
  );
}
