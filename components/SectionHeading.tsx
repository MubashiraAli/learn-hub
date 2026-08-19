import type { ElementType } from "react";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  level = 2,
}: SectionHeadingProps) {
  const Heading = `h${level}` as ElementType;

  return (
    <div className="max-w-2xl">
      <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
        {eyebrow}
      </p>
      <Heading className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        {title}
      </Heading>
      {description ? (
        <p className="mt-3 text-base leading-7 text-zinc-600 dark:text-zinc-400">
          {description}
        </p>
      ) : null}
    </div>
  );
}
