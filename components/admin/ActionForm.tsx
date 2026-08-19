"use client";

import { useActionState } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import type { ActionResult } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

type Action = (form: FormData) => Promise<ActionResult>;

/**
 * Wraps a Server Action in a form with pending state and inline feedback.
 * Actions that redirect never resolve, so no success message is shown for them.
 */
export function ActionForm({
  action,
  children,
  className,
  successLabel,
}: {
  action: Action;
  children: React.ReactNode;
  className?: string;
  successLabel?: string;
}) {
  const [state, formAction, pending] = useActionState<
    ActionResult | null,
    FormData
  >(async (_previous, formData) => action(formData), null);

  return (
    <form action={formAction} className={cn("space-y-4", className)}>
      <fieldset disabled={pending} className="contents">
        {children}
      </fieldset>

      {state && !state.ok ? (
        <p
          role="alert"
          className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400"
        >
          <AlertCircle className="h-4 w-4 shrink-0" aria-hidden />
          {state.error}
        </p>
      ) : null}

      {state?.ok && successLabel ? (
        <p className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden />
          {successLabel}
        </p>
      ) : null}
    </form>
  );
}
