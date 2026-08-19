import Link from "next/link";
import { BookOpen } from "lucide-react";
import { courseCategories } from "@/data/categories";

const platformLinks = [
  { href: "/courses", label: "Browse courses" },
  { href: "/my-learning", label: "My Learning" },
  { href: "/certificates", label: "Certificates" },
  { href: "/profile", label: "Profile" },
];

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50/60 dark:border-zinc-800 dark:bg-zinc-900/40">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-semibold tracking-tight"
              aria-label="LearnHub home"
            >
              <BookOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <span>
                Learn<span className="text-indigo-600 dark:text-indigo-400">Hub</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              A modern learning platform for courses, quizzes, and certificates
              across web development, AI, data, security, design, and cloud.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              Categories
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              {courseCategories.map((info) => (
                <li key={info.id}>
                  <Link
                    href={`/courses?category=${info.id}`}
                    className="text-zinc-500 transition-colors hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400"
                  >
                    {info.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              Platform
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              {platformLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-zinc-500 transition-colors hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-zinc-200 pt-6 text-sm text-zinc-500 sm:flex-row dark:border-zinc-800 dark:text-zinc-400">
          <p>© {new Date().getFullYear()} LearnHub. All rights reserved.</p>
          <p>Built with Next.js App Router.</p>
        </div>
      </div>
    </footer>
  );
}
