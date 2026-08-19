"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  LogOut,
  Menu,
  Search,
  User,
  ChevronDown,
  UserCircle,
} from "lucide-react";
import { Button, Drawer, Input } from "@/components/ui";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/my-learning", label: "My Learning" },
  { href: "/certificates", label: "Certificates" },
];

const PUBLIC_PATHS = ["/login", "/signup"];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );
}

function isActiveLink(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  // Admins get one extra entry; everyone else sees the navbar unchanged.
  const links =
    user?.role === "ADMIN"
      ? [...navLinks, { href: "/admin", label: "Admin" }]
      : navLinks;
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!profileOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setProfileOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [profileOpen]);

  if (!isAuthenticated || isPublicPath(pathname)) {
    return null;
  }

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = searchQuery.trim();
    setMenuOpen(false);
    router.push(query ? `/courses?search=${encodeURIComponent(query)}` : "/courses");
  }

  async function handleLogout() {
    setMenuOpen(false);
    setProfileOpen(false);
    await logout();
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
      <nav className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 text-lg font-semibold tracking-tight"
          aria-label="LearnHub home"
        >
          <BookOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          <span>
            Learn<span className="text-indigo-600 dark:text-indigo-400">Hub</span>
          </span>
        </Link>

        <ul className="hidden items-center gap-1 text-sm md:flex">
          {links.map((link) => {
            const isActive = isActiveLink(pathname, link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "rounded-md px-3 py-1.5 transition-colors",
                    isActive
                      ? "bg-zinc-100 font-medium text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
                      : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="ml-auto flex items-center gap-2">
          <form
            onSubmit={handleSearch}
            role="search"
            className="relative hidden sm:block"
          >
            <Input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search courses..."
              aria-label="Search courses"
              leftIcon={<Search className="h-4 w-4" />}
              className="w-44 lg:w-56"
            />
          </form>

          <ThemeToggle />

          <div className="relative hidden sm:block" ref={profileRef}>
            <button
              type="button"
              onClick={() => setProfileOpen(!profileOpen)}
              className={cn(
                "flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition-colors",
                profileOpen
                  ? "border-zinc-300 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800"
                  : "border-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800",
              )}
              aria-haspopup="menu"
              aria-expanded={profileOpen}
            >
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt=""
                  className="h-6 w-6 rounded-full object-cover"
                />
              ) : (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-xs font-medium text-white">
                  {(user?.name ?? "?").charAt(0).toUpperCase()}
                </span>
              )}
              <span className="max-w-[10rem] truncate text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {user?.name}
              </span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-zinc-400 transition-transform",
                  profileOpen && "rotate-180",
                )}
              />
            </button>

            {profileOpen && (
              <div
                role="menu"
                className="absolute right-0 top-full z-50 mt-1 w-56 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
              >
                <div className="border-b border-zinc-100 px-4 py-3 dark:border-zinc-800">
                  <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    {user?.name}
                  </p>
                  <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                    {user?.email}
                  </p>
                </div>
                <div className="py-1">
                  <Link
                    href="/profile"
                    onClick={() => setProfileOpen(false)}
                    role="menuitem"
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    <UserCircle className="h-4 w-4" aria-hidden />
                    Profile
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    role="menuitem"
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                  >
                    <LogOut className="h-4 w-4" aria-hidden />
                    Log out
                  </button>
                </div>
              </div>
            )}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setMenuOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            aria-label="Open menu"
            className="md:hidden"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </nav>

      <Drawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        side="right"
        title="Menu"
        description="Navigate around LearnHub"
        closeOnBreakpoint="768px"
      >
        <div className="flex flex-col gap-5">
          <form onSubmit={handleSearch} role="search">
            <Input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search courses..."
              aria-label="Search courses"
              leftIcon={<Search className="h-4 w-4" />}
            />
          </form>
          <nav aria-label="Mobile navigation">
            <ul className="flex flex-col gap-1 text-sm">
              {links.map((link) => {
                const isActive = isActiveLink(pathname, link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className={cn(
                        "block rounded-md px-3 py-2.5 transition-colors",
                        isActive
                          ? "bg-zinc-100 font-medium text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
                          : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50",
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="border-t border-zinc-200 pt-4 dark:border-zinc-800">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt=""
                    className="h-9 w-9 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-medium text-white">
                    {(user?.name ?? "?").charAt(0).toUpperCase()}
                  </span>
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    {user?.name}
                  </p>
                  <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                    {user?.email}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Link href="/profile" onClick={() => setMenuOpen(false)}>
                    <UserCircle className="h-4 w-4" />
                    Profile
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="w-full justify-start text-red-600 hover:text-red-600 dark:text-red-400 dark:hover:text-red-400"
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Drawer>
    </header>
  );
}
