"use client";

import { useState } from "react";
import type { QuizQuestion } from "@/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";
import { CheckCircle2, XCircle, RotateCcw } from "lucide-react";

interface InlineQuizProps {
  questions: QuizQuestion[];
  className?: string;
}

export function InlineQuiz({ questions, className }: InlineQuizProps) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === questions.length;

  function handleSelect(questionIndex: number, optionIndex: number) {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  }

  function handleSubmit() {
    if (!allAnswered) return;
    setSubmitted(true);
  }

  function handleRetry() {
    setAnswers({});
    setSubmitted(false);
  }

  const correctCount = submitted
    ? questions.filter((q, i) => answers[i] === q.correctIndex).length
    : 0;

  return (
    <div className={cn("space-y-6", className)}>
      <div className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-4 dark:border-indigo-900/50 dark:bg-indigo-950/30">
        <p className="text-sm font-semibold text-indigo-800 dark:text-indigo-300">
          Knowledge Check — {questions.length} Questions
        </p>
        {!submitted ? (
          <p className="mt-1 text-xs text-indigo-600/70 dark:text-indigo-400/70">
            {answeredCount} of {questions.length} answered
          </p>
        ) : (
          <p className="mt-1 text-xs text-indigo-600/70 dark:text-indigo-400/70">
            Score: {correctCount}/{questions.length} ({Math.round((correctCount / questions.length) * 100)}%)
          </p>
        )}
      </div>

      {questions.map((q, qi) => {
        const isCorrect = submitted && answers[qi] === q.correctIndex;
        const isWrong = submitted && answers[qi] !== q.correctIndex;

        return (
          <div key={q.id} className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
            <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
              <span className="mr-2 text-indigo-600 dark:text-indigo-400">{qi + 1}.</span>
              {q.question}
            </p>
            <div className="mt-3 space-y-2">
              {q.options.map((option, oi) => {
                const isSelected = answers[qi] === oi;
                const showCorrect = submitted && oi === q.correctIndex;
                const showWrong = submitted && isSelected && oi !== q.correctIndex;

                return (
                  <button
                    key={oi}
                    type="button"
                    onClick={() => handleSelect(qi, oi)}
                    disabled={submitted}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-all",
                      !submitted && isSelected
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:border-indigo-400 dark:bg-indigo-950 dark:text-indigo-300"
                        : !submitted
                          ? "border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:bg-zinc-900"
                          : showCorrect
                            ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:border-emerald-400 dark:bg-emerald-950 dark:text-emerald-300"
                            : showWrong
                              ? "border-red-500 bg-red-50 text-red-700 dark:border-red-400 dark:bg-red-950 dark:text-red-300"
                              : "border-zinc-200 text-zinc-400 dark:border-zinc-800 dark:text-zinc-600",
                    )}
                  >
                    {showCorrect ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                    ) : showWrong ? (
                      <XCircle className="h-4 w-4 shrink-0 text-red-500" />
                    ) : (
                      <span
                        className={cn(
                          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 text-xs font-medium",
                          isSelected
                            ? "border-indigo-500 bg-indigo-500 text-white"
                            : "border-zinc-300 dark:border-zinc-700",
                        )}
                      >
                        {String.fromCharCode(65 + oi)}
                      </span>
                    )}
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      <div className="flex items-center gap-3">
        {!submitted ? (
          <Button onClick={handleSubmit} disabled={!allAnswered}>
            Submit Answers
          </Button>
        ) : (
          <>
            <Button variant="outline" onClick={handleRetry}>
              <RotateCcw className="h-4 w-4" aria-hidden />
              Try Again
            </Button>
            {correctCount === questions.length ? (
              <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                Perfect score! Well done.
              </span>
            ) : correctCount >= questions.length * 0.6 ? (
              <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Good effort! Review the topics you missed.
              </span>
            ) : (
              <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                Keep studying — you&apos;ll get it next time.
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}
