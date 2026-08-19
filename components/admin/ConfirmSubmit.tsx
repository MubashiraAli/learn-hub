"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui";

function PendingButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="destructive" size="sm" isLoading={pending}>
      {label}
    </Button>
  );
}

/**
 * Two-step delete. Deletes here cascade (removing a course also removes its
 * modules, lessons, enrollments and certificates), so the confirmation is
 * inline rather than a native dialog that is easy to dismiss by reflex.
 */
export function ConfirmSubmit({
  label = "Delete",
  confirmLabel = "Confirm delete",
  hint,
}: {
  label?: string;
  confirmLabel?: string;
  hint?: string;
}) {
  const [armed, setArmed] = useState(false);

  if (!armed) {
    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setArmed(true)}
      >
        <Trash2 className="h-3.5 w-3.5" aria-hidden />
        {label}
      </Button>
    );
  }

  return (
    <span className="inline-flex items-center gap-2">
      {hint ? (
        <span className="text-xs text-red-600 dark:text-red-400">{hint}</span>
      ) : null}
      <PendingButton label={confirmLabel} />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setArmed(false)}
      >
        Cancel
      </Button>
    </span>
  );
}
