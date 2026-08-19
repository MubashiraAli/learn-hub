import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { requireAdminPage } from "@/lib/admin";
import { Badge } from "@/components/ui";

export const metadata: Metadata = {
  title: "Admin",
};

export default async function AdminLayout({
  children,
}: LayoutProps<"/admin">) {
  // Runs before any admin markup is produced. Non-admins are redirected on the
  // server, so the dashboard is never sent to the browser.
  const admin = await requireAdminPage();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 pb-5 dark:border-zinc-800">
        <div>
          <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
            Admin
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            LearnHub administration
          </h1>
        </div>
        <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
          <span className="truncate">{admin.email}</span>
          <Badge variant="secondary">ADMIN</Badge>
        </div>
      </div>

      <nav aria-label="Admin sections" className="mt-5 flex flex-wrap gap-1">
        <Link
          href="/admin"
          className="rounded-md px-3 py-1.5 text-sm text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
        >
          Overview
        </Link>
        <Link
          href="/admin/courses"
          className="rounded-md px-3 py-1.5 text-sm text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
        >
          Courses
        </Link>
        <Link
          href="/"
          className="rounded-md px-3 py-1.5 text-sm text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
        >
          ← Back to site
        </Link>
      </nav>

      <div className="mt-6">{children}</div>
    </div>
  );
}
