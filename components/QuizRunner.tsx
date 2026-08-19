"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  RotateCcw,
  Trophy,
  XCircle,
} from "lucide-react";
import type { Course, Quiz } from "@/types";
import { getCategoryLabel } from "@/data/categories";
import { useAuth } from "@/hooks/use-auth";
import { useLearningProgress } from "@/hooks";
import { cn } from "@/lib/utils";
import { Badge, Button, Card, Progress } from "@/components/ui";

const optionLetters = ["A", "B", "C", "D", "E", "F"];

function getAnswerStateClass({
  optionIndex,
  selectedIndex,
  correctIndex,
  isLocked,
}: {
  optionIndex: number;
  selectedIndex?: number;
  correctIndex: number;
  isLocked: boolean;
}) {
  if (isLocked) {
    if (optionIndex === correctIndex) {
      return "border-emerald-500 bg-emerald-50 text-emerald-800 dark:border-emerald-500 dark:bg-emerald-950 dark:text-emerald-300";
    }
    if (optionIndex === selectedIndex) {
      return "border-red-500 bg-red-50 text-red-800 dark:border-red-500 dark:bg-red-950 dark:text-red-300";
    }
    return "border-zinc-200 text-zinc-500 opacity-60 dark:border-zinc-800 dark:text-zinc-400";
  }
  if (optionIndex === selectedIndex) {
    return "border-indigo-600 bg-indigo-50 text-indigo-800 dark:border-indigo-400 dark:bg-indigo-950 dark:text-indigo-300";
  }
  return "border-zinc-200 text-zinc-800 hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-200 dark:hover:border-zinc-600 dark:hover:bg-zinc-800/60";
}

export function QuizRunner({ course, quiz }: { course: Course; quiz: Quiz }) {
  const total = quiz.questions.length;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [locked, setLocked] = useState<Record<string, boolean>>({});
  const [showResults, setShowResults] = useState(false);
  const [certificateIssued, setCertificateIssued] = useState(false);
  const { user, issueCertificate, saveQuizResult, quizResults } = useAuth();
  const { progress } = useLearningProgress(user?.id ?? null);

  const previousResult = quizResults[course.id];

  // A certificate needs the whole course finished, not just a passing quiz.
  const courseProgress = progress.courses[course.id];
  const lessonsTotal = course.modules.reduce(
    (sum, module) => sum + module.lessons.length,
    0,
  );
  const lessonsDone = courseProgress?.completedLessonIds.length ?? 0;
  const courseComplete = lessonsTotal > 0 && lessonsDone >= lessonsTotal;

  const question = quiz.questions[currentIndex];
  const selectedIndex = answers[question.id];
  const isLocked = Boolean(locked[question.id]);

  const answeredCount = Object.keys(answers).length;
  const correctCount = useMemo(
    () =>
      quiz.questions.filter((item) => answers[item.id] === item.correctIndex)
        .length,
    [answers, quiz.questions],
  );
  const percent = total ? Math.round((correctCount / total) * 100) : 0;
  const passed = percent >= quiz.passScore;

  function selectOption(optionIndex: number) {
    if (isLocked) return;
    setAnswers((prev) => ({ ...prev, [question.id]: optionIndex }));
  }

  function lockCurrent() {
    if (selectedIndex === undefined) return;
    setLocked((prev) => ({ ...prev, [question.id]: true }));
  }

  function goToQuestion(index: number) {
    setCurrentIndex(Math.max(0, Math.min(total - 1, index)));
  }

  function retry() {
    setAnswers({});
    setLocked({});
    setCurrentIndex(0);
    setShowResults(false);
    setCertificateIssued(false);
    submittedRef.current = false;
  }

  // Record the attempt exactly once per completed run. Previously this ran
  // during render, so every re-render wrote another QuizAttempt row.
  const submittedRef = useRef(false);
  useEffect(() => {
    if (!showResults || submittedRef.current) return;
    submittedRef.current = true;

    void (async () => {
      await saveQuizResult(course.id, {
        courseId: course.id,
        score: percent,
        correctCount,
        totalQuestions: total,
        passed,
        completedAt: new Date().toISOString(),
      });
      // The server enforces this too; checking here avoids a pointless 409.
      if (passed && courseComplete) {
        const certificate = await issueCertificate(course.id, percent);
        if (certificate) setCertificateIssued(true);
      }
    })();
  }, [
    showResults,
    course.id,
    percent,
    correctCount,
    total,
    passed,
    courseComplete,
    saveQuizResult,
    issueCertificate,
  ]);

  const isLastQuestion = currentIndex === total - 1;
  const showFeedback = isLocked;
  const isCorrect = showFeedback && selectedIndex === question.correctIndex;

  if (showResults) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <div
              className={cn(
                "flex h-16 w-16 items-center justify-center rounded-full",
                passed
                  ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
                  : "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400",
              )}
            >
              {passed ? (
                <Trophy className="h-8 w-8" aria-hidden />
              ) : (
                <XCircle className="h-8 w-8" aria-hidden />
              )}
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                Quiz complete
              </p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                {quiz.title}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-4xl font-bold tabular-nums text-zinc-900 dark:text-zinc-50">
                {percent}%
              </span>
              <Badge variant={passed ? "success" : "danger"}>
                {passed ? "Passed" : "Not passed"}
              </Badge>
            </div>

            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              You answered {correctCount} of {total} questions correctly. A score
              of {quiz.passScore}% or higher is required to pass.
            </p>

            {passed && certificateIssued ? (
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                A certificate has been added to your profile!
              </p>
            ) : null}

            {passed && !courseComplete ? (
              <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
                Finish all {lessonsTotal} lessons to unlock your certificate —
                {" "}
                {lessonsDone} of {lessonsTotal} completed.
              </p>
            ) : null}

            <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
              <Button variant="secondary" onClick={retry}>
                <RotateCcw className="h-4 w-4" aria-hidden />
                Retake quiz
              </Button>
              <Button asChild>
                <Link href={`/courses/${course.id}`}>
                  <ArrowLeft className="h-4 w-4" aria-hidden />
                  Back to course
                </Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href={`/learn/${course.id}`}>
                  <BookOpen className="h-4 w-4" aria-hidden />
                  Continue lessons
                </Link>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href={`/courses/${course.id}`}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
          >
            ← Back to course
          </Link>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {quiz.title}
          </h1>
          <div className="mt-1 flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
            <span>{course.title}</span>
            <Badge variant="secondary">
              {getCategoryLabel(course.category)}
            </Badge>
          </div>
          {previousResult ? (
            <div className="mt-2 flex items-center gap-2 text-sm">
              <span className="text-zinc-500 dark:text-zinc-400">Previous attempt:</span>
              <Badge variant={previousResult.passed ? "success" : "danger"}>
                {previousResult.score}%
              </Badge>
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400">
          <span>
            Question {currentIndex + 1} of {total}
          </span>
          <span>
            {answeredCount} of {total} answered
          </span>
        </div>
        <Progress
          value={total ? (answeredCount / total) * 100 : 0}
          className="mt-2"
        />
      </div>

      <Card className="mt-6 p-6">
        <p className="text-sm font-medium uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
          Question {currentIndex + 1}
        </p>
        <h2 className="mt-2 text-lg font-semibold leading-7 text-zinc-900 dark:text-zinc-50">
          {question.question}
        </h2>

        <div className="mt-5 space-y-2.5" role="group" aria-label="Answer options">
          {question.options.map((option, optionIndex) => {
            const letter = optionLetters[optionIndex];
            const stateClass = getAnswerStateClass({
              optionIndex,
              selectedIndex,
              correctIndex: question.correctIndex,
              isLocked,
            });
            return (
              <button
                key={optionIndex}
                type="button"
                disabled={isLocked}
                onClick={() => selectOption(optionIndex)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm font-medium transition-colors disabled:cursor-default",
                  stateClass,
                )}
              >
                <span
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                    isLocked && optionIndex === question.correctIndex
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : isLocked && optionIndex === selectedIndex
                        ? "border-red-500 bg-red-500 text-white"
                        : optionIndex === selectedIndex
                          ? "border-indigo-600 bg-indigo-600 text-white"
                          : "border-zinc-300 text-zinc-500 dark:border-zinc-600 dark:text-zinc-400",
                  )}
                >
                  {isLocked &&
                  optionIndex === question.correctIndex ? (
                    <CheckCircle2 className="h-4 w-4" aria-hidden />
                  ) : isLocked &&
                    optionIndex === selectedIndex ? (
                    <XCircle className="h-4 w-4" aria-hidden />
                  ) : (
                    letter
                  )}
                </span>
                <span className="flex-1">{option}</span>
              </button>
            );
          })}
        </div>

        {showFeedback ? (
          <div
            className={cn(
              "mt-5 rounded-lg border px-4 py-3 text-sm font-medium",
              isCorrect
                ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300"
                : "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300",
            )}
          >
            {isCorrect ? (
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" aria-hidden />
                Correct! Nice work.
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <XCircle className="h-4 w-4" aria-hidden />
                Not quite. The correct answer is {optionLetters[question.correctIndex]}.
              </span>
            )}
          </div>
        ) : null}
      </Card>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {quiz.questions.map((item, index) => {
            const isAnswered = answers[item.id] !== undefined;
            const isLockedItem = Boolean(locked[item.id]);
            const isCorrectItem =
              isLockedItem && answers[item.id] === item.correctIndex;
            return (
              <button
                key={item.id}
                type="button"
                aria-label={`Go to question ${index + 1}`}
                aria-current={index === currentIndex ? "step" : undefined}
                onClick={() => goToQuestion(index)}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-medium transition-colors",
                  index === currentIndex
                    ? "border-indigo-600 bg-indigo-600 text-white"
                    : isCorrectItem
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                      : isLockedItem
                        ? "border-red-500 bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
                        : isAnswered
                          ? "border-indigo-300 bg-indigo-50 text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950 dark:text-indigo-300"
                          : "border-zinc-300 text-zinc-500 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800",
                )}
              >
                {isLockedItem ? (
                  isCorrectItem ? (
                    <CheckCircle2 className="h-4 w-4" aria-hidden />
                  ) : (
                    <XCircle className="h-4 w-4" aria-hidden />
                  )
                ) : (
                  index + 1
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            disabled={currentIndex === 0}
            onClick={() => goToQuestion(currentIndex - 1)}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Previous
          </Button>

          {!isLocked ? (
            <Button disabled={selectedIndex === undefined} onClick={lockCurrent}>
              Check answer
            </Button>
          ) : isLastQuestion ? (
            <Button onClick={() => setShowResults(true)}>
              See results
              <Trophy className="h-4 w-4" aria-hidden />
            </Button>
          ) : (
            <Button onClick={() => goToQuestion(currentIndex + 1)}>
              Next question
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
          )}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center border-t border-zinc-200 pt-5 dark:border-zinc-800">
        <Link
          href={`/courses/${course.id}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to course details
        </Link>
      </div>
    </div>
  );
}
