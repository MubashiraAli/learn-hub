"use client";

import { useEffect } from "react";
import Link from "next/link";
import { TriangleAlert } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 text-center text-zinc-900">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
          <TriangleAlert className="h-6 w-6" aria-hidden />
        </div>
        <h2 className="mt-6 text-2xl font-semibold tracking-tight">
          Something went wrong
        </h2>
        <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-500">
          A critical error occurred. Try reloading the page to get back into
          your learning.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-zinc-900 px-6 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-zinc-300 bg-transparent px-6 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100"
          >
            Back to home
          </Link>
        </div>
      </body>
    </html>
  );
}
