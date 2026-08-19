"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input, buttonVariants } from "@/components/ui";
import { getCategoryLabel } from "@/data/categories";
import type { CourseCategory, CourseLevel } from "@/types";

const levelOptions: { value: "" | CourseLevel; label: string }[] = [
  { value: "", label: "All levels" },
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

const ratingOptions: { value: string; label: string }[] = [
  { value: "", label: "Any rating" },
  { value: "4.7", label: "4.7 & up" },
  { value: "4.9", label: "4.9 & up" },
];

const priceOptions: { value: string; label: string }[] = [
  { value: "", label: "Any price" },
  { value: "free", label: "Free" },
  { value: "lt100", label: "Under $100" },
  { value: "lt150", label: "Under $150" },
];

const sortOptions: { value: string; label: string }[] = [
  { value: "popular", label: "Most popular" },
  { value: "rating", label: "Highest rated" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "duration", label: "Shortest duration" },
];

const selectClassName =
  "h-10 rounded-lg border border-zinc-300 bg-white px-3 pr-8 text-sm text-zinc-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50";

export interface CourseFiltersProps {
  categories: CourseCategory[];
}

export function CourseFilters({ categories }: CourseFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") ?? "";
  const category = searchParams.get("category") ?? "";
  const level = searchParams.get("level") ?? "";
  const rating = searchParams.get("rating") ?? "";
  const price = searchParams.get("price") ?? "";
  const sort = searchParams.get("sort") ?? "popular";

  const [searchValue, setSearchValue] = useState(search);
  const previousSearch = useRef(search);

  const applyFilters = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value) params.set(key, value);
        else params.delete(key);
      }
      const qs = params.toString();
      router.push(qs ? `/courses?${qs}` : "/courses", { scroll: false });
    },
    [router, searchParams],
  );

  useEffect(() => {
    if (previousSearch.current !== search) {
      previousSearch.current = search;
      setSearchValue(search);
    }
  }, [search]);

  useEffect(() => {
    const id = setTimeout(() => {
      if (searchValue !== search) {
        applyFilters({ search: searchValue });
      }
    }, 350);
    return () => clearTimeout(id);
  }, [searchValue, search, applyFilters]);

  const activeCount = [search, category, level, rating, price].filter(
    (value) => value.length > 0,
  ).length;

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    applyFilters({ search: searchValue });
  }

  return (
    <div className="mt-8 space-y-4">
      <form onSubmit={handleSearchSubmit} role="search" className="max-w-xl">
        <Input
          type="search"
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          placeholder="Search courses, e.g. Next.js, AI, AWS..."
          aria-label="Search courses"
          leftIcon={<Search className="h-4 w-4" />}
          className="h-11 bg-white dark:bg-zinc-900"
        />
      </form>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => applyFilters({ category: "" })}
          className={cn(
            "rounded-full border px-4 py-1.5 text-sm transition-colors",
            category
              ? "border-zinc-300 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              : "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-50 dark:bg-zinc-50 dark:text-zinc-900",
          )}
        >
          All
        </button>
        {categories.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => applyFilters({ category: id })}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm transition-colors",
              category === id
                ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-50 dark:bg-zinc-50 dark:text-zinc-900"
                : "border-zinc-300 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800",
            )}
          >
            {getCategoryLabel(id)}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Level
            <select
              value={level}
              onChange={(event) => applyFilters({ level: event.target.value })}
              className={selectClassName}
              aria-label="Filter by level"
            >
              {levelOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Rating
            <select
              value={rating}
              onChange={(event) => applyFilters({ rating: event.target.value })}
              className={selectClassName}
              aria-label="Filter by rating"
            >
              {ratingOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Price
            <select
              value={price}
              onChange={(event) => applyFilters({ price: event.target.value })}
              className={selectClassName}
              aria-label="Filter by price"
            >
              {priceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="flex flex-col gap-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
          Sort by
          <select
            value={sort}
            onChange={(event) => applyFilters({ sort: event.target.value })}
            className={selectClassName}
            aria-label="Sort courses"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {activeCount > 0 ? (
        <button
          type="button"
          onClick={() => router.push("/courses")}
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "text-zinc-500",
          )}
        >
          <X className="h-4 w-4" aria-hidden />
          Clear all filters
        </button>
      ) : null}
    </div>
  );
}
