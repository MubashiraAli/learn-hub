import Link from "next/link";
import { notFound } from "next/navigation";
import { Plus, Video } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdminPage } from "@/lib/admin";
import { courseCategories } from "@/data/categories";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Textarea,
} from "@/components/ui";
import { ActionForm } from "@/components/admin/ActionForm";
import { ConfirmSubmit } from "@/components/admin/ConfirmSubmit";
import {
  createLesson,
  createModule,
  createQuestion,
  deleteCourse,
  deleteLesson,
  deleteModule,
  deleteQuestion,
  deleteQuiz,
  updateCourse,
  updateLesson,
  updateModule,
  setLessonVideo,
  updateQuestion,
  upsertQuiz,
} from "../../actions";

const levels = ["beginner", "intermediate", "advanced"];
const lessonTypes = ["video", "article", "exercise"];
const optionLetters = ["A", "B", "C", "D"];

const selectClass =
  "mt-1.5 h-10 w-full rounded-lg border border-zinc-300 bg-transparent px-3 text-sm text-zinc-900 dark:border-zinc-700 dark:text-zinc-50";

export default async function AdminCourseDetailPage({
  params,
}: PageProps<"/admin/courses/[courseId]">) {
  await requireAdminPage();
  const { courseId } = await params;

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      modules: {
        orderBy: { position: "asc" },
        include: { lessons: { orderBy: { position: "asc" } } },
      },
      quiz: { include: { questions: { orderBy: { position: "asc" } } } },
      _count: { select: { enrollments: true, certificates: true } },
    },
  });

  if (!course) notFound();

  const lessonCount = course.modules.reduce(
    (sum, m) => sum + m.lessons.length,
    0,
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            href="/admin/courses"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
          >
            ← All courses
          </Link>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {course.title}
          </h2>
          <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
            <span className="font-mono text-xs">{course.id}</span>
            <Badge variant="secondary">{course.modules.length} modules</Badge>
            <Badge variant="secondary">{lessonCount} lessons</Badge>
            <Badge variant="secondary">
              {course._count.enrollments} enrolled
            </Badge>
            <Badge variant="secondary">
              {course._count.certificates} certificates
            </Badge>
          </p>
        </div>
        <ActionForm action={deleteCourse}>
          <input type="hidden" name="id" value={course.id} />
          <ConfirmSubmit
            label="Delete course"
            confirmLabel="Delete permanently"
            hint="Also deletes enrollments, progress and certificates."
          />
        </ActionForm>
      </div>

      {/* ── Course details ─────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle>Course details</CardTitle>
        </CardHeader>
        <CardContent>
          <ActionForm
            action={updateCourse}
            successLabel="Course saved."
            className="border-t border-zinc-100 pt-5 dark:border-zinc-800"
          >
            <input type="hidden" name="id" value={course.id} />
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={course.title}
                  required
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="instructorId">Instructor id</Label>
                <Input
                  id="instructorId"
                  name="instructorId"
                  defaultValue={course.instructorId}
                  className="mt-1.5"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                rows={2}
                defaultValue={course.description}
                className="mt-1.5"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  name="category"
                  defaultValue={course.category}
                  className={selectClass}
                >
                  {courseCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="level">Level</Label>
                <select
                  id="level"
                  name="level"
                  defaultValue={course.level}
                  className={`${selectClass} capitalize`}
                >
                  {levels.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="durationHours">Duration (hours)</Label>
                <Input
                  id="durationHours"
                  name="durationHours"
                  type="number"
                  min={1}
                  defaultValue={course.durationHours}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="language">Language</Label>
                <Input
                  id="language"
                  name="language"
                  defaultValue={course.language}
                  className="mt-1.5"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-4">
              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min={0}
                  defaultValue={course.price}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="originalPrice">Original price</Label>
                <Input
                  id="originalPrice"
                  name="originalPrice"
                  type="number"
                  min={0}
                  defaultValue={course.originalPrice ?? ""}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="rating">Rating</Label>
                <Input
                  id="rating"
                  name="rating"
                  type="number"
                  step="0.1"
                  min={0}
                  max={5}
                  defaultValue={course.rating}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="studentsCount">Students</Label>
                <Input
                  id="studentsCount"
                  name="studentsCount"
                  type="number"
                  min={0}
                  defaultValue={course.studentsCount}
                  className="mt-1.5"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  name="tags"
                  defaultValue={course.tags.join(", ")}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  defaultValue={course.imageUrl ?? ""}
                  className="mt-1.5"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="learningOutcomes">
                  Learning outcomes (one per line)
                </Label>
                <Textarea
                  id="learningOutcomes"
                  name="learningOutcomes"
                  rows={4}
                  defaultValue={course.learningOutcomes.join("\n")}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="requirements">Requirements (one per line)</Label>
                <Textarea
                  id="requirements"
                  name="requirements"
                  rows={4}
                  defaultValue={course.requirements.join("\n")}
                  className="mt-1.5"
                />
              </div>
            </div>

            <Button type="submit">Save course</Button>
          </ActionForm>
        </CardContent>
      </Card>

      {/* ── Modules & lessons ──────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle>Modules and lessons</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-5 border-t border-zinc-100 pt-5 dark:border-zinc-800">
            {course.modules.map((module) => (
              <div
                key={module.id}
                className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"
              >
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <ActionForm action={updateModule} className="flex-1 space-y-0">
                    <input type="hidden" name="id" value={module.id} />
                    <Label htmlFor={`module-${module.id}`}>
                      Module {module.slug}
                    </Label>
                    <div className="mt-1.5 flex gap-2">
                      <Input
                        id={`module-${module.id}`}
                        name="title"
                        defaultValue={module.title}
                        required
                      />
                      <Button type="submit" variant="outline" size="sm">
                        Save
                      </Button>
                    </div>
                  </ActionForm>
                  <ActionForm action={deleteModule}>
                    <input type="hidden" name="id" value={module.id} />
                    <ConfirmSubmit
                      label="Delete module"
                      hint="Removes its lessons too."
                    />
                  </ActionForm>
                </div>

                <ul className="mt-4 space-y-2">
                  {module.lessons.map((lesson) => (
                    <li
                      key={lesson.id}
                      className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-900/50"
                    >
                      <div className="flex flex-wrap items-end gap-2">
                        <ActionForm
                          action={updateLesson}
                          className="flex flex-1 flex-wrap items-end gap-2 space-y-0"
                        >
                          <input type="hidden" name="id" value={lesson.id} />
                          <span className="pb-2.5 font-mono text-xs text-zinc-400">
                            {lesson.slug}
                          </span>
                          {lesson.videoUrl ? (
                            <span className="pb-2.5">
                              <Badge variant="success">video</Badge>
                            </span>
                          ) : null}
                          <div className="min-w-[12rem] flex-1">
                            <Label htmlFor={`lesson-title-${lesson.id}`}>
                              Title
                            </Label>
                            <Input
                              id={`lesson-title-${lesson.id}`}
                              name="title"
                              defaultValue={lesson.title}
                              required
                              className="mt-1"
                            />
                          </div>
                          <div className="w-28">
                            <Label htmlFor={`lesson-type-${lesson.id}`}>
                              Type
                            </Label>
                            <select
                              id={`lesson-type-${lesson.id}`}
                              name="type"
                              defaultValue={lesson.type}
                              className={`${selectClass} mt-1 capitalize`}
                            >
                              {lessonTypes.map((t) => (
                                <option key={t} value={t}>
                                  {t}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="w-24">
                            <Label htmlFor={`lesson-mins-${lesson.id}`}>
                              Minutes
                            </Label>
                            <Input
                              id={`lesson-mins-${lesson.id}`}
                              name="durationMinutes"
                              type="number"
                              min={1}
                              defaultValue={lesson.durationMinutes}
                              className="mt-1"
                            />
                          </div>
                          <input
                            type="hidden"
                            name="description"
                            value={lesson.description}
                          />
                          <div className="w-full">
                            <Label htmlFor={`lesson-video-${lesson.id}`}>
                              Video URL
                            </Label>
                            <Input
                              id={`lesson-video-${lesson.id}`}
                              name="videoUrl"
                              type="url"
                              defaultValue={lesson.videoUrl ?? ""}
                              placeholder="YouTube/Vimeo link, or a direct .mp4 URL"
                              className="mt-1"
                            />
                          </div>
                          <Button type="submit" variant="outline" size="sm">
                            Save
                          </Button>
                        </ActionForm>
                        <ActionForm action={deleteLesson}>
                          <input type="hidden" name="id" value={lesson.id} />
                          <ConfirmSubmit label="Delete" />
                        </ActionForm>
                      </div>
                    </li>
                  ))}
                  {module.lessons.length === 0 ? (
                    <li className="text-sm text-zinc-400">No lessons yet.</li>
                  ) : null}
                </ul>

                <ActionForm
                  action={createLesson}
                  className="mt-4 flex flex-wrap items-end gap-2 space-y-0"
                >
                  <input type="hidden" name="moduleId" value={module.id} />
                  <div className="min-w-[12rem] flex-1">
                    <Label htmlFor={`new-lesson-${module.id}`}>New lesson</Label>
                    <Input
                      id={`new-lesson-${module.id}`}
                      name="title"
                      placeholder="Lesson title"
                      required
                      className="mt-1"
                    />
                  </div>
                  <div className="w-28">
                    <Label htmlFor={`new-lesson-type-${module.id}`}>Type</Label>
                    <select
                      id={`new-lesson-type-${module.id}`}
                      name="type"
                      defaultValue="video"
                      className={`${selectClass} mt-1 capitalize`}
                    >
                      {lessonTypes.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-24">
                    <Label htmlFor={`new-lesson-mins-${module.id}`}>
                      Minutes
                    </Label>
                    <Input
                      id={`new-lesson-mins-${module.id}`}
                      name="durationMinutes"
                      type="number"
                      min={1}
                      defaultValue={15}
                      className="mt-1"
                    />
                  </div>
                  <div className="w-full">
                    <Label htmlFor={`new-lesson-video-${module.id}`}>
                      Video URL (optional)
                    </Label>
                    <Input
                      id={`new-lesson-video-${module.id}`}
                      name="videoUrl"
                      type="url"
                      placeholder="YouTube/Vimeo link, or a direct .mp4 URL"
                      className="mt-1"
                    />
                  </div>
                  <Button type="submit" size="sm">
                    <Plus className="h-3.5 w-3.5" aria-hidden />
                    Add lesson
                  </Button>
                </ActionForm>
              </div>
            ))}

            <ActionForm
              action={createModule}
              className="flex flex-wrap items-end gap-2 space-y-0"
            >
              <input type="hidden" name="courseId" value={course.id} />
              <div className="min-w-[14rem] flex-1">
                <Label htmlFor="new-module">New module</Label>
                <Input
                  id="new-module"
                  name="title"
                  placeholder="Module title"
                  required
                  className="mt-1.5"
                />
              </div>
              <Button type="submit">
                <Plus className="h-4 w-4" aria-hidden />
                Add module
              </Button>
            </ActionForm>
          </div>
        </CardContent>
      </Card>

      {/* ── Lesson videos ─────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle>
            <span className="inline-flex items-center gap-2">
              <Video className="h-4 w-4 text-indigo-500" aria-hidden />
              Lesson videos
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-t border-zinc-100 pt-5 dark:border-zinc-800">
            <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
              Paste a YouTube or Vimeo link, a direct <code>.mp4</code> URL, or a
              path under <code>/public</code>. Leave blank to remove a video.
            </p>

            {lessonCount === 0 ? (
              <p className="text-sm text-zinc-400">
                Add a module and some lessons first.
              </p>
            ) : (
              <ul className="space-y-3">
                {course.modules.map((module) =>
                  module.lessons.map((lesson) => (
                    <li
                      key={lesson.id}
                      className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800"
                    >
                      <ActionForm action={setLessonVideo} successLabel="Video saved.">
                        <input type="hidden" name="id" value={lesson.id} />
                        <div className="flex flex-wrap items-end gap-3">
                          <div className="min-w-[16rem] flex-1">
                            <Label htmlFor={`video-${lesson.id}`}>
                              <span className="font-mono text-xs text-zinc-400">
                                {module.slug}/{lesson.slug}
                              </span>{" "}
                              {lesson.title}
                            </Label>
                            <Input
                              id={`video-${lesson.id}`}
                              name="videoUrl"
                              type="url"
                              defaultValue={lesson.videoUrl ?? ""}
                              placeholder="https://www.youtube.com/watch?v=..."
                              className="mt-1.5"
                            />
                          </div>
                          <Badge variant={lesson.videoUrl ? "success" : "outline"}>
                            {lesson.videoUrl ? "has video" : "no video"}
                          </Badge>
                          <Button type="submit" variant="outline" size="sm">
                            Save
                          </Button>
                        </div>
                      </ActionForm>
                    </li>
                  )),
                )}
              </ul>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── Quiz ───────────────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle>Quiz</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-5 border-t border-zinc-100 pt-5 dark:border-zinc-800">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <ActionForm
                action={upsertQuiz}
                successLabel="Quiz saved."
                className="flex flex-1 flex-wrap items-end gap-2 space-y-0"
              >
                <input type="hidden" name="courseId" value={course.id} />
                <div className="min-w-[14rem] flex-1">
                  <Label htmlFor="quiz-title">Quiz title</Label>
                  <Input
                    id="quiz-title"
                    name="title"
                    defaultValue={course.quiz?.title ?? `${course.title} Quiz`}
                    required
                    className="mt-1.5"
                  />
                </div>
                <div className="w-32">
                  <Label htmlFor="quiz-pass">Pass score %</Label>
                  <Input
                    id="quiz-pass"
                    name="passScore"
                    type="number"
                    min={0}
                    max={100}
                    defaultValue={course.quiz?.passScore ?? 70}
                    className="mt-1.5"
                  />
                </div>
                <Button type="submit">
                  {course.quiz ? "Save quiz" : "Create quiz"}
                </Button>
              </ActionForm>

              {course.quiz ? (
                <ActionForm action={deleteQuiz}>
                  <input type="hidden" name="courseId" value={course.id} />
                  <ConfirmSubmit
                    label="Delete quiz"
                    hint="Removes all its questions."
                  />
                </ActionForm>
              ) : null}
            </div>

            {course.quiz ? (
              <>
                <ul className="space-y-3">
                  {course.quiz.questions.map((question, index) => (
                    <li
                      key={question.id}
                      className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"
                    >
                      <ActionForm action={updateQuestion} successLabel="Saved.">
                        <input type="hidden" name="id" value={question.id} />
                        <div className="flex items-center justify-between gap-3">
                          <Label htmlFor={`q-${question.id}`}>
                            Question {index + 1}
                            <span className="ml-2 font-mono text-xs text-zinc-400">
                              {question.slug}
                            </span>
                          </Label>
                        </div>
                        <Textarea
                          id={`q-${question.id}`}
                          name="prompt"
                          rows={2}
                          defaultValue={question.prompt}
                          required
                          className="mt-1.5"
                        />
                        <div className="grid gap-3 sm:grid-cols-2">
                          {optionLetters.map((letter, optionIndex) => (
                            <div key={letter}>
                              <Label htmlFor={`q-${question.id}-${letter}`}>
                                Option {letter}
                              </Label>
                              <Input
                                id={`q-${question.id}-${letter}`}
                                name={`option${letter}`}
                                defaultValue={question.options[optionIndex] ?? ""}
                                className="mt-1"
                              />
                            </div>
                          ))}
                        </div>
                        <div className="flex flex-wrap items-end gap-3">
                          <div className="w-40">
                            <Label htmlFor={`q-${question.id}-correct`}>
                              Correct answer
                            </Label>
                            <select
                              id={`q-${question.id}-correct`}
                              name="correctIndex"
                              defaultValue={String(question.correctIndex)}
                              className={selectClass}
                            >
                              {optionLetters.map((letter, optionIndex) => (
                                <option key={letter} value={optionIndex}>
                                  {letter}
                                </option>
                              ))}
                            </select>
                          </div>
                          <Button type="submit" variant="outline" size="sm">
                            Save question
                          </Button>
                        </div>
                      </ActionForm>

                      <div className="mt-3 border-t border-zinc-100 pt-3 dark:border-zinc-800">
                        <ActionForm action={deleteQuestion}>
                          <input type="hidden" name="id" value={question.id} />
                          <ConfirmSubmit label="Delete question" />
                        </ActionForm>
                      </div>
                    </li>
                  ))}
                  {course.quiz.questions.length === 0 ? (
                    <li className="text-sm text-zinc-400">No questions yet.</li>
                  ) : null}
                </ul>

                <div className="rounded-xl border border-dashed border-zinc-300 p-4 dark:border-zinc-700">
                  <ActionForm action={createQuestion}>
                    <input type="hidden" name="quizId" value={course.quiz.id} />
                    <Label htmlFor="new-question">Add a question</Label>
                    <Textarea
                      id="new-question"
                      name="prompt"
                      rows={2}
                      placeholder="Question text"
                      required
                      className="mt-1.5"
                    />
                    <div className="grid gap-3 sm:grid-cols-2">
                      {optionLetters.map((letter) => (
                        <div key={letter}>
                          <Label htmlFor={`new-option-${letter}`}>
                            Option {letter}
                          </Label>
                          <Input
                            id={`new-option-${letter}`}
                            name={`option${letter}`}
                            className="mt-1"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-wrap items-end gap-3">
                      <div className="w-40">
                        <Label htmlFor="new-correct">Correct answer</Label>
                        <select
                          id="new-correct"
                          name="correctIndex"
                          defaultValue="0"
                          className={selectClass}
                        >
                          {optionLetters.map((letter, optionIndex) => (
                            <option key={letter} value={optionIndex}>
                              {letter}
                            </option>
                          ))}
                        </select>
                      </div>
                      <Button type="submit">
                        <Plus className="h-4 w-4" aria-hidden />
                        Add question
                      </Button>
                    </div>
                  </ActionForm>
                </div>
              </>
            ) : (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                This course has no quiz yet. Create one above to add questions.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
