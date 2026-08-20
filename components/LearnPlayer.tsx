"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentType } from "react";
import {
  ArrowLeft,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Code2,
  FileText,
  Link2,
  Play,
  StickyNote,
} from "lucide-react";
import type { Course, Lesson, LessonResourceKind } from "@/types";
import { getCategoryLabel } from "@/data/categories";
import { useLearningProgress, useLocalStorage } from "@/hooks";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { Badge, Button, Card, Drawer, Progress, StorageWarning } from "@/components/ui";
import { CourseThumbnail } from "@/components/CourseThumbnail";
import { resolveVideoSource } from "@/lib/video";

const resourceIcons: Record<
  LessonResourceKind,
  ComponentType<{ className?: string }>
> = {
  pdf: FileText,
  code: Code2,
  link: Link2,
};

type Tab = "description" | "notes" | "resources";

function formatTime(minutes: number): string {
  const totalSeconds = Math.round(minutes * 60);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function CurriculumList({
  course,
  currentLessonId,
  completedLessonIds,
  lessonNumbers,
  onSelect,
  className,
}: {
  course: Course;
  currentLessonId: string;
  completedLessonIds: string[];
  lessonNumbers: Map<string, number>;
  onSelect: (lesson: Lesson) => void;
  className?: string;
}) {
  return (
    <div className={cn("overflow-y-auto", className)}>
      {course.modules.map((module, moduleIndex) => (
        <div
          key={module.id}
          className="border-b border-zinc-100 last:border-0 dark:border-zinc-800"
        >
          <div className="px-4 pb-1 pt-3">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
              Module {moduleIndex + 1}
            </p>
            <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
              {module.title}
            </p>
          </div>
          <ul className="py-1">
            {module.lessons.map((lesson) => {
              const isActive = lesson.id === currentLessonId;
              const isDone = completedLessonIds.includes(lesson.id);
              return (
                <li key={lesson.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(lesson)}
                    className={cn(
                      "flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors",
                      isActive
                        ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                        : "text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800/60",
                    )}
                  >
                    {isDone ? (
                      <CheckCircle2
                        className="h-4 w-4 shrink-0 text-emerald-500"
                        aria-hidden
                      />
                    ) : isActive ? (
                      <Play
                        className="h-4 w-4 shrink-0 fill-current text-indigo-600 dark:text-indigo-400"
                        aria-hidden
                      />
                    ) : (
                      <span
                        className="flex h-4 w-4 shrink-0 items-center justify-center text-xs font-medium text-zinc-400"
                        aria-hidden
                      >
                        {lessonNumbers.get(lesson.id)}
                      </span>
                    )}
                    <span className="flex-1 truncate">
                      {lesson.title}
                    </span>
                    <span className="shrink-0 text-xs text-zinc-400">
                      {lesson.durationMinutes}m
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}

/**
 * Plays the lesson's video when one is attached.
 *
 * Replaces a non-functional mock (a static thumbnail, a play button wired to
 * nothing, and a progress bar hardcoded to one third). Lessons with no
 * videoUrl keep a thumbnail, but it now says so rather than pretending to be
 * a player.
 */
function VideoPlayer({
  course,
  lesson,
}: {
  course: Course;
  lesson: Lesson;
}) {
  const source = resolveVideoSource(lesson.videoUrl);

  if (source.kind === "file") {
    return (
      <div className="relative aspect-video overflow-hidden rounded-xl bg-black">
        <video
          key={source.src}
          className="h-full w-full"
          src={source.src}
          controls
          controlsList="nodownload"
          preload="metadata"
          playsInline
        />
      </div>
    );
  }

  if (source.kind === "embed") {
    return (
      <div className="relative aspect-video overflow-hidden rounded-xl bg-black">
        <iframe
          key={source.src}
          className="absolute inset-0 h-full w-full"
          src={source.src}
          title={lesson.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    );
  }

  // No video attached yet.
  return (
    <div className="relative aspect-video overflow-hidden rounded-xl bg-zinc-950">
      <CourseThumbnail course={course} className="opacity-40" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-white/70">
          <Play className="ml-0.5 h-7 w-7 fill-current" aria-hidden />
        </span>
        <p className="px-6 text-sm text-zinc-300">
          No video for this lesson yet.
        </p>
        <p className="text-xs text-zinc-500">
          {formatTime(lesson.durationMinutes)} planned
        </p>
      </div>
    </div>
  );
}

export function LearnPlayer({
  course,
  initialLessonId,
}: {
  course: Course;
  initialLessonId: string;
}) {
  const router = useRouter();
  const { user } = useAuth();

  const lessons = course.modules.flatMap((module) => module.lessons);
  const lessonNumbers = new Map(
    lessons.map((lesson, index) => [lesson.id, index + 1]),
  );

  const currentIndex = lessons.findIndex((lesson) => lesson.id === initialLessonId);
  const currentLesson = lessons[currentIndex] ?? lessons[0];
  const currentModule =
    course.modules.find((module) =>
      module.lessons.some((lesson) => lesson.id === currentLesson.id),
    ) ?? course.modules[0];
  const lessonIndexInModule =
    currentModule?.lessons.findIndex((lesson) => lesson.id === currentLesson.id) ??
    0;

  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : undefined;
  const nextLesson =
    currentIndex >= 0 && currentIndex < lessons.length - 1
      ? lessons[currentIndex + 1]
      : undefined;

  const {
    progress: learningProgress,
    setCurrentLesson,
    toggleCompleted: toggleLessonCompleted,
    storageError,
  } = useLearningProgress(user?.id ?? null);
  const courseProgress = learningProgress.courses[course.id];
  const [notes, setNotes, notesError] = useLocalStorage<Record<string, string>>(
    `learn-notes:${course.id}`,
    {},
  );
  const [activeTab, setActiveTab] = useState<Tab>("description");
  const [isCurriculumOpen, setIsCurriculumOpen] = useState(false);

  const completedLessonIds = courseProgress?.completedLessonIds ?? [];
  const completedCount = completedLessonIds.length;
  const progress = lessons.length
    ? Math.round((completedCount / lessons.length) * 100)
    : 0;
  const isCompleted = completedLessonIds.includes(currentLesson.id);

  const saveCurrentLesson = useCallback(() => {
    setCurrentLesson(course.id, currentLesson.id);
  }, [course.id, currentLesson.id, setCurrentLesson]);

  useEffect(() => {
    saveCurrentLesson();
  }, [saveCurrentLesson]);

  function goToLesson(lesson: Lesson) {
    setIsCurriculumOpen(false);
    router.push(`/learn/${course.id}?lesson=${lesson.id}`, { scroll: false });
  }

  function handleToggleCompleted() {
    toggleLessonCompleted(course.id, currentLesson.id, lessons.length);
  }

  const currentNotes = notes[currentLesson.id] ?? "";

  const tabs: { id: Tab; label: string; Icon: ComponentType<{ className?: string }> }[] = [
    { id: "description", label: "Description", Icon: FileText },
    { id: "notes", label: "Notes", Icon: StickyNote },
    { id: "resources", label: "Resources", Icon: BookOpen },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href={`/courses/${course.id}`}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
          >
            ← Course details
          </Link>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {course.title}
          </h1>
        </div>
        <Badge>{getCategoryLabel(course.category)}</Badge>
      </div>

      {storageError || notesError ? (
        <div className="mt-4 space-y-2">
          {storageError ? (
            <StorageWarning label="Your course progress can't be saved right now." />
          ) : null}
          {notesError ? (
            <StorageWarning label="Your notes can't be saved right now." />
          ) : null}
        </div>
      ) : null}

      <div className="mt-6">
        <div className="flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400">
          <span>Course progress</span>
          <span>
            {completedCount} of {lessons.length} lessons · {progress}%
          </span>
        </div>
        <Progress
          value={progress}
          className="mt-2"
          indicatorClassName="bg-emerald-500 dark:bg-emerald-400"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        {/* Curriculum sidebar (desktop) */}
        <aside className="hidden lg:block">
          <Card className="overflow-hidden">
            <div className="border-b border-zinc-100 p-4 dark:border-zinc-800">
              <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">
                Curriculum
              </h2>
              <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
                {course.modules.length} modules · {lessons.length} lessons
              </p>
            </div>
            <CurriculumList
              course={course}
              currentLessonId={currentLesson.id}
              completedLessonIds={completedLessonIds}
              lessonNumbers={lessonNumbers}
              onSelect={goToLesson}
              className="max-h-[560px]"
            />
          </Card>
        </aside>

        {/* Player column */}
        <main className="min-w-0">
          <div className="mb-4 flex items-center justify-between gap-3 lg:hidden">
            <Button
              variant="outline"
              onClick={() => setIsCurriculumOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={isCurriculumOpen}
            >
              <BookOpen className="h-4 w-4" aria-hidden />
              Curriculum
            </Button>
            <span className="truncate text-sm text-zinc-500 dark:text-zinc-400">
              {currentModule
                ? `Module ${course.modules.indexOf(currentModule) + 1} · Lesson ${lessonIndexInModule + 1} of ${currentModule.lessons.length}`
                : ""}
            </span>
          </div>

          <VideoPlayer course={course} lesson={currentLesson} />

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {currentModule ? `Module ${course.modules.indexOf(currentModule) + 1} · Lesson ${lessonIndexInModule + 1} of ${currentModule.lessons.length}` : ""}
              </p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                {currentLesson.title}
              </h2>
              <div className="mt-1 flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" aria-hidden />
                  {currentLesson.durationMinutes} min
                </span>
                <Badge variant="secondary">
                  {currentLesson.type.charAt(0).toUpperCase() +
                    currentLesson.type.slice(1)}
                </Badge>
              </div>
            </div>
            <Button
              variant={isCompleted ? "secondary" : "outline"}
              onClick={handleToggleCompleted}
            >
              {isCompleted ? (
                <CheckCircle2 className="h-4 w-4" aria-hidden />
              ) : (
                <Check className="h-4 w-4" aria-hidden />
              )}
              {isCompleted ? "Completed" : "Mark completed"}
            </Button>
          </div>

          <div className="mt-5 flex items-center justify-between gap-3">
            <Button
              variant="outline"
              disabled={!prevLesson}
              onClick={() => prevLesson && goToLesson(prevLesson)}
            >
              <ChevronLeft className="h-4 w-4" aria-hidden />
              Previous
            </Button>
            <Button
              disabled={!nextLesson}
              onClick={() => nextLesson && goToLesson(nextLesson)}
            >
              Next
              <ChevronRight className="h-4 w-4" aria-hidden />
            </Button>
          </div>

          <div className="mt-8">
            <div className="flex gap-1 border-b border-zinc-200 dark:border-zinc-800">
              {tabs.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveTab(id)}
                  className={cn(
                    "flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
                    activeTab === id
                      ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                      : "border-transparent text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50",
                  )}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                  {label}
                </button>
              ))}
            </div>

            {activeTab === "description" ? (
              <div className="mt-5">
                <p className="text-sm leading-7 text-zinc-600 dark:text-zinc-400">
                  {currentLesson.description}
                </p>
              </div>
            ) : null}

            {activeTab === "notes" ? (
              <div className="mt-5">
                <label
                  htmlFor={`notes-${currentLesson.id}`}
                  className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Your notes
                </label>
                <textarea
                  id={`notes-${currentLesson.id}`}
                  value={currentNotes}
                  onChange={(event) =>
                    setNotes({
                      ...notes,
                      [currentLesson.id]: event.target.value,
                    })
                  }
                  rows={6}
                  placeholder="Jot down key ideas, questions, or timestamps as you learn..."
                  className="mt-2 w-full resize-y rounded-lg border border-zinc-300 bg-transparent px-3 py-2.5 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:text-zinc-50"
                />
                <p className="mt-2 text-xs text-zinc-400">
                  Notes are saved automatically to this browser.
                </p>
              </div>
            ) : null}

            {activeTab === "resources" ? (
              <ul className="mt-5 space-y-2">
                {currentLesson.resources.map((resource) => {
                  const Icon = resourceIcons[resource.kind];
                  return (
                    <li key={resource.id}>
                      <div className="flex items-center gap-3 rounded-lg border border-zinc-200 px-4 py-3 dark:border-zinc-800">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                          <Icon className="h-4 w-4" aria-hidden />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-zinc-800 dark:text-zinc-200">
                            {resource.title}
                          </p>
                          <p className="text-xs capitalize text-zinc-400">
                            {resource.kind}
                          </p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-zinc-200 pt-5 dark:border-zinc-800">
            <Link
              href={`/courses/${course.id}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Back to course details
            </Link>
          </div>
        </main>
      </div>

      <Drawer
        open={isCurriculumOpen}
        onClose={() => setIsCurriculumOpen(false)}
        side="left"
        size="lg"
        title="Curriculum"
        description={`${course.modules.length} modules · ${lessons.length} lessons`}
        closeOnBreakpoint="1024px"
      >
        <CurriculumList
          course={course}
          currentLessonId={currentLesson.id}
          completedLessonIds={completedLessonIds}
          lessonNumbers={lessonNumbers}
          onSelect={goToLesson}
        />
      </Drawer>
    </div>
  );
}
