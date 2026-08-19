"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button, Input } from "@/components/ui";

export function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    router.push(
      trimmed ? `/courses?search=${encodeURIComponent(trimmed)}` : "/courses",
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className="mx-auto flex w-full max-w-xl flex-col gap-2 sm:flex-row"
    >
      <Input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search courses, e.g. Next.js, AI, AWS..."
        aria-label="Search courses"
        leftIcon={<Search className="h-4 w-4" />}
        className="h-12 bg-white dark:bg-zinc-900"
      />
      <Button type="submit" size="lg" className="shrink-0">
        Search
      </Button>
    </form>
  );
}
