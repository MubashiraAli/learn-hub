"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFocusTrap } from "@/hooks";

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  side?: "left" | "right";
  size?: "sm" | "md" | "lg";
  closeOnBreakpoint?: string;
}

const sizeClasses = {
  sm: "max-w-xs",
  md: "max-w-sm",
  lg: "max-w-lg",
};

export function Drawer({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  side = "right",
  size = "md",
  closeOnBreakpoint,
}: DrawerProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useFocusTrap(wrapperRef, open);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open || !closeOnBreakpoint) return;
    const media = window.matchMedia(`(min-width: ${closeOnBreakpoint})`);
    const handleChange = () => {
      if (media.matches) onClose();
    };
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, [open, closeOnBreakpoint, onClose]);

  if (!open) return null;

  return createPortal(
    <div ref={wrapperRef} className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close drawer"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-zinc-950/50 backdrop-blur-sm animate-overlay-in motion-reduce:animate-none"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descriptionId : undefined}
        className={cn(
          "absolute inset-y-0 flex w-full flex-col bg-white shadow-2xl dark:bg-zinc-900",
          side === "right"
            ? "right-0 animate-drawer-slide-in-right motion-reduce:animate-none"
            : "left-0 animate-drawer-slide-in-left motion-reduce:animate-none",
          sizeClasses[size],
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-zinc-200 p-4 dark:border-zinc-800">
          <div className="min-w-0">
            {title ? (
              <h2
                id={titleId}
                className="truncate text-lg font-semibold text-zinc-900 dark:text-zinc-50"
              >
                {title}
              </h2>
            ) : null}
            {description ? (
              <p
                id={descriptionId}
                className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400"
              >
                {description}
              </p>
            ) : null}
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close drawer"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>

        {children ? (
          <div className="flex-1 overflow-y-auto p-4">{children}</div>
        ) : null}

        {footer ? (
          <div className="flex flex-wrap items-center justify-end gap-2 border-t border-zinc-200 p-4 dark:border-zinc-800">
            {footer}
          </div>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
