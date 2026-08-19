"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Certificate, LearningProgress, QuizResult, User } from "@/types";
import {
  apiEnroll,
  apiIssueCertificate,
  apiLogin,
  apiLogout,
  apiSaveQuizResult,
  apiSignup,
  apiUpdateProfile,
  apiUpdateProgress,
  emptyProgress,
  fetchCertificates,
  fetchMe,
  fetchProgress,
  fetchQuizResults,
} from "@/lib/auth-client";

export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  /** True until the session has been resolved against the server. */
  isLoading: boolean;
  /** True when a write to the server failed; drives the existing warnings. */
  storageError: boolean;

  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<User | null>;
  enrollInCourse: (courseId: string) => Promise<User | null>;

  certificates: Certificate[];
  issueCertificate: (
    courseId: string,
    score: number,
  ) => Promise<Certificate | null>;

  quizResults: Record<string, QuizResult>;
  saveQuizResult: (courseId: string, result: QuizResult) => Promise<void>;

  progress: LearningProgress;
  setCurrentLesson: (courseId: string, lessonId: string) => Promise<void>;
  toggleCompleted: (courseId: string, lessonId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [storageError, setStorageError] = useState(false);

  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [quizResults, setQuizResults] = useState<Record<string, QuizResult>>({});
  const [progress, setProgress] = useState<LearningProgress>(emptyProgress);

  const clearUserState = useCallback(() => {
    setUser(null);
    setCertificates([]);
    setQuizResults({});
    setProgress(emptyProgress);
  }, []);

  /** Loads everything that belongs to the signed-in user. */
  const loadUserData = useCallback(async () => {
    const [certs, results, prog] = await Promise.all([
      fetchCertificates().catch(() => ({ certificates: [] })),
      fetchQuizResults().catch(() => ({ results: {} })),
      fetchProgress().catch(() => ({ progress: emptyProgress })),
    ]);
    setCertificates(certs.certificates);
    setQuizResults(results.results);
    setProgress(prog.progress);
  }, []);

  // Resolve the session cookie on first mount. This is what makes a refresh
  // keep the user signed in.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { user: me } = await fetchMe();
        if (cancelled) return;
        setUser(me);
        if (me) await loadUserData();
      } catch {
        if (!cancelled) clearUserState();
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [loadUserData, clearUserState]);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const { user: me } = await apiLogin(email, password);
        setUser(me);
        await loadUserData();
        return true;
      } catch {
        return false;
      }
    },
    [loadUserData],
  );

  const signup = useCallback(
    async (name: string, email: string, password: string) => {
      try {
        const { user: me } = await apiSignup(name, email, password);
        setUser(me);
        await loadUserData();
        return true;
      } catch {
        return false;
      }
    },
    [loadUserData],
  );

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } finally {
      // Clear locally even if the request failed, so the UI cannot appear
      // signed in with a dead session.
      clearUserState();
    }
  }, [clearUserState]);

  const updateProfile = useCallback(async (updates: Partial<User>) => {
    try {
      const { user: next } = await apiUpdateProfile(updates);
      setUser(next);
      setStorageError(false);
      return next;
    } catch {
      setStorageError(true);
      return null;
    }
  }, []);

  const enrollInCourse = useCallback(async (courseId: string) => {
    try {
      const { user: next } = await apiEnroll(courseId);
      setUser(next);
      return next;
    } catch {
      setStorageError(true);
      return null;
    }
  }, []);

  const issueCertificate = useCallback(
    async (courseId: string, score: number) => {
      try {
        const { certificate } = await apiIssueCertificate(courseId, score);
        setCertificates((prev) =>
          prev.some((c) => c.id === certificate.id)
            ? prev
            : [certificate, ...prev],
        );
        return certificate;
      } catch {
        setStorageError(true);
        return null;
      }
    },
    [],
  );

  const saveQuizResult = useCallback(
    async (courseId: string, result: QuizResult) => {
      try {
        const { result: saved } = await apiSaveQuizResult(courseId, result);
        setQuizResults((prev) => ({ ...prev, [courseId]: saved }));
        setStorageError(false);
      } catch {
        setStorageError(true);
      }
    },
    [],
  );

  const setCurrentLesson = useCallback(
    async (courseId: string, lessonId: string) => {
      try {
        const { progress: next } = await apiUpdateProgress(
          courseId,
          lessonId,
          "setCurrent",
        );
        setProgress(next);
        setStorageError(false);
      } catch {
        setStorageError(true);
      }
    },
    [],
  );

  const toggleCompleted = useCallback(
    async (courseId: string, lessonId: string) => {
      try {
        const { progress: next } = await apiUpdateProgress(
          courseId,
          lessonId,
          "toggleCompleted",
        );
        setProgress(next);
        setStorageError(false);
      } catch {
        setStorageError(true);
      }
    },
    [],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      isLoading,
      storageError,
      login,
      signup,
      logout,
      updateProfile,
      enrollInCourse,
      certificates,
      issueCertificate,
      quizResults,
      saveQuizResult,
      progress,
      setCurrentLesson,
      toggleCompleted,
    }),
    [
      user,
      isLoading,
      storageError,
      login,
      signup,
      logout,
      updateProfile,
      enrollInCourse,
      certificates,
      issueCertificate,
      quizResults,
      saveQuizResult,
      progress,
      setCurrentLesson,
      toggleCompleted,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used inside <AuthProvider>.");
  }
  return context;
}
