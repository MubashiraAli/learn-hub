"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Spinner } from "@/components/ui";

const PUBLIC_PATHS = ["/login", "/signup"];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );
}

/**
 * Wraps page content to enforce authentication.
 *
 * The session now lives in an httpOnly cookie, so the client cannot know who
 * is signed in until `/api/auth/me` answers. `isLoading` covers that window:
 * the server and the first client render both show the skeleton, so hydration
 * matches, and no redirect is decided until the session is resolved.
 */
export function AuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (isPublicPath(pathname) && isAuthenticated) {
      router.replace("/");
    } else if (!isPublicPath(pathname) && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, pathname, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div
        role="status"
        aria-label="Checking authentication"
        className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-sm text-zinc-400 dark:text-zinc-500"
      >
        <Spinner size="lg" />
        <span>Loading…</span>
      </div>
    );
  }

  // Avoid flashing protected content for one frame before the redirect lands.
  if (!isPublicPath(pathname) && !isAuthenticated) {
    return (
      <div
        role="status"
        aria-label="Redirecting to sign in"
        className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-sm text-zinc-400 dark:text-zinc-500"
      >
        <Spinner size="lg" />
        <span>Loading…</span>
      </div>
    );
  }

  return <>{children}</>;
}
