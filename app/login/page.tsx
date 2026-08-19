"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react";
import { Button, Input, Label, Card, CardContent } from "@/components/ui";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

interface FieldErrors {
  email?: string;
  password?: string;
}

function validateEmail(value: string): string | undefined {
  if (!value.trim()) return "Email is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email address.";
  return undefined;
}

function validatePassword(value: string): string | undefined {
  if (!value) return "Password is required.";
  if (value.length < 6) return "Password must be at least 6 characters.";
  return undefined;
}

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = useCallback((fields?: (keyof FieldErrors)[]) => {
    const checks: [keyof FieldErrors, string | undefined][] = [
      ["email", validateEmail(email)],
      ["password", validatePassword(password)],
    ];
    const next: FieldErrors = {};
    let valid = true;
    for (const [field, msg] of checks) {
      if (fields && !fields.includes(field)) continue;
      if (msg) {
        next[field] = msg;
        valid = false;
      }
    }
    setFieldErrors((prev) => {
      if (fields && fields.length === 1) {
        return { ...prev, [fields[0]]: next[fields[0]] };
      }
      return { ...prev, ...next };
    });
    return valid;
  }, [email, password]);

  function handleBlur(field: keyof FieldErrors) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validate([field]);
  }

  function handleChange(field: keyof FieldErrors, value: string) {
    if (field === "email") setEmail(value);
    if (field === "password") setPassword(value);

    if (touched[field]) {
      const msg = field === "email" ? validateEmail(value) : validatePassword(value);
      setFieldErrors((prev) => ({ ...prev, [field]: msg }));
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setServerError("");

    const fields: (keyof FieldErrors)[] = ["email", "password"];
    setTouched({ email: true, password: true });

    if (!validate(fields)) return;

    setIsLoading(true);

    void (async () => {
      const success = await login(email, password);
      if (success) {
        router.replace("/");
      } else {
        setServerError("Invalid email or password. Please try again.");
        setIsLoading(false);
      }
    })();
  }

  const emailError = touched.email ? fieldErrors.email : undefined;
  const passwordError = touched.password ? fieldErrors.password : undefined;

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12 sm:px-6">
      <div className="w-full max-w-md animate-fade-in-up">
        <Card className="overflow-hidden">
          <CardContent className="p-8">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 dark:bg-indigo-900/30">
                <BookOpen className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">
                Welcome back
              </h1>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Sign in to continue your learning journey
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {serverError && (
                <div
                  role="alert"
                  className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400"
                >
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {serverError}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  leftIcon={<Mail className="h-4 w-4" />}
                  value={email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  onBlur={() => handleBlur("email")}
                  autoComplete="email"
                  aria-invalid={!!emailError}
                  aria-describedby={emailError ? "email-error" : undefined}
                  className={cn(
                    emailError &&
                      "border-red-500 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500",
                  )}
                />
                {emailError && (
                  <p id="email-error" className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    {emailError}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  leftIcon={<Lock className="h-4 w-4" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="pointer-events-auto cursor-pointer text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  }
                  value={password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  onBlur={() => handleBlur("password")}
                  autoComplete="current-password"
                  aria-invalid={!!passwordError}
                  aria-describedby={passwordError ? "password-error" : undefined}
                  className={cn(
                    passwordError &&
                      "border-red-500 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500",
                  )}
                />
                {passwordError && (
                  <p id="password-error" className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    {passwordError}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={rememberMe}
                  onClick={() => setRememberMe(!rememberMe)}
                  className={cn(
                    "h-4 w-4 shrink-0 rounded border transition-colors",
                    rememberMe
                      ? "border-indigo-600 bg-indigo-600 dark:border-indigo-400 dark:bg-indigo-400"
                      : "border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-900",
                  )}
                >
                  {rememberMe && (
                    <svg
                      className="h-full w-full text-white"
                      viewBox="0 0 12 12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2.5 6L5 8.5L9.5 3.5" />
                    </svg>
                  )}
                </button>
                <Label
                  htmlFor="remember"
                  className="cursor-pointer text-sm font-normal text-zinc-600 dark:text-zinc-400"
                  onClick={() => setRememberMe(!rememberMe)}
                >
                  Remember me
                </Label>
              </div>

              <Button
                type="submit"
                variant="secondary"
                size="lg"
                className="w-full"
                isLoading={isLoading}
                disabled={isLoading}
              >
                Sign in
              </Button>
            </form>

            <div className="mt-5 text-center">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
