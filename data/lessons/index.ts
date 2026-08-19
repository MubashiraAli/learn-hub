import type { LessonVideoScript, QuizQuestion, VideoScene } from "@/types";
import cloudComputingModelsJson from "./cloud-computing-models.json";

/**
 * JSON imports widen string literals (e.g. `"read"` becomes `string`), so the
 * shape is asserted once here at the boundary. `npm run lint` plus the timing
 * checks in scripts/generate-lesson-script.mjs guard the contents.
 */
export const cloudComputingModelsScript =
  cloudComputingModelsJson as unknown as LessonVideoScript;

export const lessonVideoScripts: LessonVideoScript[] = [
  cloudComputingModelsScript,
];

export function getLessonVideoScript(
  courseId: string,
  lessonId: string,
): LessonVideoScript | undefined {
  return lessonVideoScripts.find(
    (script) => script.courseId === courseId && script.lessonId === lessonId,
  );
}

export function getScenes(script: LessonVideoScript): VideoScene[] {
  return script.sections.flatMap((section) => section.scenes);
}

/** The scene playing at a given offset, for transcript sync or scrubbing. */
export function getSceneAt(
  script: LessonVideoScript,
  seconds: number,
): VideoScene | undefined {
  return getScenes(script).find(
    (scene) =>
      seconds >= scene.startSeconds &&
      seconds < scene.startSeconds + scene.durationSeconds,
  );
}

export function formatTimecode(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function vttTimestamp(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h.toString().padStart(2, "0")}:${m
    .toString()
    .padStart(2, "0")}:${s.toFixed(3).padStart(6, "0")}`;
}

/** WebVTT captions built from the narration, ready to attach to a <track>. */
export function toWebVtt(script: LessonVideoScript): string {
  const cues = getScenes(script)
    .filter((scene) => scene.narration.trim().length > 0)
    .map((scene, index) => {
      const start = vttTimestamp(scene.startSeconds);
      const end = vttTimestamp(scene.startSeconds + scene.durationSeconds);
      return `${index + 1}\n${start} --> ${end}\n${scene.narration}`;
    });
  return `WEBVTT\n\n${cues.join("\n\n")}\n`;
}

/**
 * The five knowledge-check questions as LearnHub quiz questions, so the
 * in-video check and an InlineQuiz can share one source of truth.
 */
export function toQuizQuestions(script: LessonVideoScript): QuizQuestion[] {
  return getScenes(script)
    .filter((scene) => scene.quiz?.phase === "read")
    .map((scene) => {
      const quiz = scene.quiz!;
      return {
        id: quiz.questionId,
        question: quiz.question ?? "",
        options: quiz.options ?? [],
        correctIndex: quiz.correctIndex ?? 0,
      };
    });
}
