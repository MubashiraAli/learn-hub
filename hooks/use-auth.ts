"use client";

import { useAuthContext } from "@/components/AuthProvider";

/**
 * Database-backed session state.
 *
 * The shape is unchanged from the previous localStorage implementation so that
 * existing components keep working; the mutating calls are now promises
 * because they hit the API. `isLoading` is new and is what AuthGate waits on
 * before deciding whether to redirect.
 */
export function useAuth() {
  const {
    user,
    isAuthenticated,
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
  } = useAuthContext();

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    signup,
    logout,
    updateProfile,
    enrollInCourse,
    certificates,
    issueCertificate,
    quizResults,
    saveQuizResult,
    storageError,
  };
}
