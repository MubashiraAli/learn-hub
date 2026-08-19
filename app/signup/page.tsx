"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, Eye, EyeOff, Mail, Lock, User, AlertCircle } from "lucide-react";
import { Button, Input, Label, Card, CardContent } from "@/components/ui";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

interface FieldErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

function validateName(value: string): string | undefined {
  if (!value.trim()) return "Name is required.";
  if (value.trim().length < 2) return "Name must be at least 2 characters.";
  return undefined;
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

function validateConfirmPassword(value: string, password: string): string | undefined {
  if (!value) return "Please confirm your password.";
  if (value !== password) return "Passwords do not match.";
  return undefined;
}

export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = useCallback((fields?: (keyof FieldErrors)[]) => {
    const checks: [keyof FieldErrors, string | undefined][] = [
      ["name", validateName(name)],
      ["email", validateEmail(email)],
      ["password", validatePassword(password)],
      ["confirmPassword", validateConfirmPassword(confirmPassword, password)],
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
  }, [name, email, password, confirmPassword]);

  function handleBlur(field: keyof FieldErrors) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validate([field]);
  }

  function handleChange(field: keyof FieldErrors, value: string) {
    if (field === "name") setName(value);
    if (field === "email") setEmail(value);
    if (field === "password") setPassword(value);
    if (field === "confirmPassword") setConfirmPassword(value);

    if (touched[field]) {
      let msg: string | undefined;
      if (field === "name") msg = validateName(value);
      else if (field === "email") msg = validateEmail(value);
      else if (field === "password") msg = validatePassword(value);
      else if (field === "confirmPassword") msg = validateConfirmPassword(value, password);
      setFieldErrors((prev) => ({ ...prev, [field]: msg }));
    }

    if (touched.confirmPassword && field === "password") {
      const msg = validateConfirmPassword(confirmPassword, value);
      setFieldErrors((prev) => ({ ...prev, confirmPassword: msg }));
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setServerError("");

    const fields: (keyof FieldErrors)[] = ["name", "email", "password", "confirmPassword"];
    setTouched({ name: true, email: true, password: true, confirmPassword: true });

    if (!validate(fields)) return;

    setIsLoading(true);

    void (async () => {
      const success = await signup(name.trim(), email.trim(), password);
      if (success) {
        router.replace("/");
      } else {
        setServerError("An account with this email already exists.");
        setIsLoading(false);
      }
    })();
  }

  const nameError = touched.name ? fieldErrors.name : undefined;
  const emailError = touched.email ? fieldErrors.email : undefined;
  const passwordError = touched.password ? fieldErrors.password : undefined;
  const confirmError = touched.confirmPassword ? fieldErrors.confirmPassword : undefined;

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
                Create your account
              </h1>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Start your learning journey today
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
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Jane Smith"
                  leftIcon={<User className="h-4 w-4" />}
                  value={name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  onBlur={() => handleBlur("name")}
                  autoComplete="name"
                  aria-invalid={!!nameError}
                  aria-describedby={nameError ? "name-error" : undefined}
                  className={cn(
                    nameError &&
                      "border-red-500 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500",
                  )}
                />
                {nameError && (
                  <p id="name-error" className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    {nameError}
                  </p>
                )}
              </div>

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
                  placeholder="At least 6 characters"
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
                  autoComplete="new-password"
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <Input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Re-enter your password"
                  leftIcon={<Lock className="h-4 w-4" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="pointer-events-auto cursor-pointer text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                      aria-label={showConfirm ? "Hide password" : "Show password"}
                    >
                      {showConfirm ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  }
                  value={confirmPassword}
                  onChange={(e) => handleChange("confirmPassword", e.target.value)}
                  onBlur={() => handleBlur("confirmPassword")}
                  autoComplete="new-password"
                  aria-invalid={!!confirmError}
                  aria-describedby={confirmError ? "confirm-error" : undefined}
                  className={cn(
                    confirmError &&
                      "border-red-500 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500",
                  )}
                />
                {confirmError && (
                  <p id="confirm-error" className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    {confirmError}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                variant="secondary"
                size="lg"
                className="w-full"
                isLoading={isLoading}
                disabled={isLoading}
              >
                Create account
              </Button>
            </form>

            <div className="mt-5 text-center">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
