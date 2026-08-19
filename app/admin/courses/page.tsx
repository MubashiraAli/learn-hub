import Link from "next/link";
import { Plus } from "lucide-react";
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
import { createCourse } from "../actions";

const levels = ["beginner", "intermediate", "advanced"];

export default async function AdminCoursesPage() {
  await requireAdminPage();

  const courses = await prisma.course.findMany({
    orderBy: { title: "asc" },
    include: {
      _count: { select: { modules: true, enrollments: true } },
      quiz: { select: { id: true, _count: { select: { questions: true } } } },
      modules: { select: { _count: { select: { lessons: true } } } },
    },
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create a course</CardTitle>
        </CardHeader>
        <CardContent>
          <ActionForm action={createCourse} className="border-t border-zinc-100 pt-5 dark:border-zinc-800">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="new-title">Title</Label>
                <Input id="new-title" name="title" required className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="new-id">Course id (slug)</Label>
                <Input
                  id="new-id"
                  name="id"
                  placeholder="derived from the title if left blank"
                  className="mt-1.5"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="new-description">Description</Label>
              <Textarea
                id="new-description"
                name="description"
                rows={2}
                className="mt-1.5"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-4">
              <div>
                <Label htmlFor="new-category">Category</Label>
                <select
                  id="new-category"
                  name="category"
                  defaultValue="web-development"
                  className="mt-1.5 h-10 w-full rounded-lg border border-zinc-300 bg-transparent px-3 text-sm text-zinc-900 dark:border-zinc-700 dark:text-zinc-50"
                >
                  {courseCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="new-level">Level</Label>
                <select
                  id="new-level"
                  name="level"
                  defaultValue="beginner"
                  className="mt-1.5 h-10 w-full rounded-lg border border-zinc-300 bg-transparent px-3 text-sm capitalize text-zinc-900 dark:border-zinc-700 dark:text-zinc-50"
                >
                  {levels.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="new-duration">Duration (hours)</Label>
                <Input
                  id="new-duration"
                  name="durationHours"
                  type="number"
                  min={1}
                  defaultValue={10}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="new-price">Price</Label>
                <Input
                  id="new-price"
                  name="price"
                  type="number"
                  min={0}
                  defaultValue={0}
                  className="mt-1.5"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="new-tags">Tags</Label>
              <Input
                id="new-tags"
                name="tags"
                placeholder="comma separated"
                className="mt-1.5"
              />
            </div>

            <Button type="submit">
              <Plus className="h-4 w-4" aria-hidden />
              Create course
            </Button>
          </ActionForm>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All courses ({courses.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto border-t border-zinc-100 dark:border-zinc-800">
            <table className="w-full min-w-[46rem] text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-zinc-400">
                  <th className="py-2.5 pr-4 font-medium">Course</th>
                  <th className="py-2.5 pr-4 font-medium">Category</th>
                  <th className="py-2.5 pr-4 text-right font-medium">Modules</th>
                  <th className="py-2.5 pr-4 text-right font-medium">Lessons</th>
                  <th className="py-2.5 pr-4 text-right font-medium">Questions</th>
                  <th className="py-2.5 pr-4 text-right font-medium">Enrolled</th>
                  <th className="py-2.5 font-medium" />
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => {
                  const lessons = course.modules.reduce(
                    (sum, m) => sum + m._count.lessons,
                    0,
                  );
                  return (
                    <tr
                      key={course.id}
                      className="border-t border-zinc-100 dark:border-zinc-800"
                    >
                      <td className="py-2.5 pr-4">
                        <span className="font-medium text-zinc-800 dark:text-zinc-200">
                          {course.title}
                        </span>
                        <span className="ml-2 font-mono text-xs text-zinc-400">
                          {course.id}
                        </span>
                      </td>
                      <td className="py-2.5 pr-4">
                        <Badge variant="secondary">{course.category}</Badge>
                      </td>
                      <td className="py-2.5 pr-4 text-right tabular-nums text-zinc-500 dark:text-zinc-400">
                        {course._count.modules}
                      </td>
                      <td className="py-2.5 pr-4 text-right tabular-nums text-zinc-500 dark:text-zinc-400">
                        {lessons}
                      </td>
                      <td className="py-2.5 pr-4 text-right tabular-nums text-zinc-500 dark:text-zinc-400">
                        {course.quiz?._count.questions ?? "—"}
                      </td>
                      <td className="py-2.5 pr-4 text-right tabular-nums text-zinc-500 dark:text-zinc-400">
                        {course._count.enrollments}
                      </td>
                      <td className="py-2.5 text-right">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/admin/courses/${course.id}`}>Manage</Link>
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
