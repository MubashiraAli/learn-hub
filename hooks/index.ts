"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useSyncExternalStore,
  type RefObject,
} from "react";
import { useAuthContext } from "@/components/AuthProvider";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
  "audio[controls]",
  "video[controls]",
].join(", ");

function getFocusableElements(
  container: HTMLElement,
): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
  ).filter((element) => {
    if (element.hasAttribute("hidden")) return false;
    if (element.getAttribute("aria-hidden") === "true") return false;
    return element.getClientRects().length > 0;
  });
}

export function useFocusTrap(
  containerRef: RefObject<HTMLElement | null>,
  active: boolean,
  restoreFocus = true,
) {
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active || !containerRef.current) return;

    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Tab") return;
      const container = containerRef.current;
      if (!container) return;
      const focusable = getFocusableElements(container);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (restoreFocus) previouslyFocusedRef.current?.focus();
    };
  }, [containerRef, active, restoreFocus]);
}

interface LocalStorageStore<T> {
  read(): T;
  getServerSnapshot(): T;
  getError(): boolean;
  getServerError(): boolean;
  write(value: T): void;
  subscribe(listener: () => void): () => void;
}

const stores = new Map<string, LocalStorageStore<unknown>>();

function createLocalStorageStore<T>(
  key: string,
  initialValue: T,
): LocalStorageStore<T> {
  let cache: T = initialValue;
  let lastRaw: string | null = null;
  let failed = false;
  const listeners = new Set<() => void>();

  function notify() {
    listeners.forEach((listener) => listener());
  }

  function read(): T {
    if (typeof window === "undefined") return initialValue;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw === lastRaw) return cache;
      lastRaw = raw;
      cache = raw === null ? initialValue : (JSON.parse(raw) as T);
      if (failed) {
        // A previous failure recovered; clear the flag on the next tick so
        // the snapshot can change without re-entering this read.
        failed = false;
        queueMicrotask(notify);
      }
    } catch {
      // Fall back to the cached value on malformed or unreadable data.
      if (!failed) {
        failed = true;
        queueMicrotask(notify);
      }
    }
    return cache;
  }

  function getError(): boolean {
    return failed;
  }

  function getServerError(): boolean {
    return false;
  }

  function write(value: T): void {
    cache = value;
    try {
      lastRaw = JSON.stringify(value);
      window.localStorage.setItem(key, lastRaw);
      failed = false;
    } catch {
      // Ignore write errors (private mode, quota exceeded, etc.)
      failed = true;
    }
    listeners.forEach((listener) => listener());
  }

  function onExternalChange(event: Event | StorageEvent) {
    if ("key" in event && event.key !== null && event.key !== key) return;
    lastRaw = null;
    listeners.forEach((listener) => listener());
  }

  function subscribe(listener: () => void): () => void {
    listeners.add(listener);
    const handleStorage = (event: StorageEvent) => onExternalChange(event);
    window.addEventListener("storage", handleStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", handleStorage);
    };
  }

  return {
    read,
    getServerSnapshot: () => initialValue,
    getError,
    getServerError,
    write,
    subscribe,
  };
}

function getLocalStorageStore<T>(
  key: string,
  initialValue: T,
): LocalStorageStore<T> {
  const existing = stores.get(key) as LocalStorageStore<T> | undefined;
  if (existing) return existing;
  const store = createLocalStorageStore(key, initialValue);
  stores.set(key, store as LocalStorageStore<unknown>);
  return store;
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void, boolean] {
  const store = getLocalStorageStore(key, initialValue);
  const value = useSyncExternalStore(
    store.subscribe,
    store.read,
    store.getServerSnapshot,
  );
  const hasError = useSyncExternalStore(
    store.subscribe,
    store.getError,
    store.getServerError,
  );

  const setStoredValue = useCallback(
    (updater: T | ((prev: T) => T)) => {
      const next =
        typeof updater === "function"
          ? (updater as (prev: T) => T)(store.read())
          : updater;
      store.write(next);
    },
    [store],
  );

  return [value, setStoredValue, hasError];
}

export function useLearningProgress(userId: string | null) {
  const { progress, setCurrentLesson, toggleCompleted, storageError } =
    useAuthContext();

  // `userId` is retained so existing call sites keep working; the server
  // already scopes progress to the session user, so it is not needed here.
  void userId;

  const toggle = useCallback(
    (courseId: string, lessonId: string, _totalLessons?: number) => {
      void _totalLessons; // the server recomputes the percentage
      return toggleCompleted(courseId, lessonId);
    },
    [toggleCompleted],
  );

  return {
    progress,
    setCurrentLesson,
    toggleCompleted: toggle,
    storageError,
  };
}

export { useAuth } from "./use-auth";
