import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdminPage } from "@/lib/admin";
import { formatDate } from "@/lib/utils";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { ActionForm } from "@/components/admin/ActionForm";
import { setUserRole } from "./actions";

export default async function AdminOverviewPage() {
  const admin = await requireAdminPage();

  const [
    userCount,
    courseCount,
    lessonCount,
    enrollmentCount,
    certificateCount,
    attemptCount,
    users,
    enrollments,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.course.count(),
    prisma.lesson.count(),
    prisma.enrollment.count(),
    prisma.certificate.count(),
    prisma.quizAttempt.count(),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { enrollments: true, certificates: true, quizAttempts: true },
        },
      },
    }),
    prisma.enrollment.findMany({
      orderBy: { startedAt: "desc" },
      take: 50,
      include: {
        user: { select: { name: true, email: true } },
        course: { select: { title: true, id: true } },
      },
    }),
  ]);

  const stats = [
    { label: "Users", value: userCount },
    { label: "Courses", value: courseCount },
    { label: "Lessons", value: lessonCount },
    { label: "Enrollments", value: enrollmentCount },
    { label: "Quiz attempts", value: attemptCount },
    { label: "Certificates", value: certificateCount },
  ];

  return (
    <div className="space-y-6">
      <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-4">
            <dd className="text-2xl font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
              {stat.value}
            </dd>
            <dt className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
              {stat.label}
            </dt>
          </Card>
        ))}
      </dl>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto border-t border-zinc-100 dark:border-zinc-800">
            <table className="w-full min-w-[46rem] text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-zinc-400">
                  <th className="py-2.5 pr-4 font-medium">Name</th>
                  <th className="py-2.5 pr-4 font-medium">Email</th>
                  <th className="py-2.5 pr-4 font-medium">Joined</th>
                  <th className="py-2.5 pr-4 text-right font-medium">Courses</th>
                  <th className="py-2.5 pr-4 text-right font-medium">Certs</th>
                  <th className="py-2.5 pr-4 text-right font-medium">Attempts</th>
                  <th className="py-2.5 font-medium">Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-t border-zinc-100 dark:border-zinc-800"
                  >
                    <td className="py-2.5 pr-4 font-medium text-zinc-800 dark:text-zinc-200">
                      {user.name}
                    </td>
                    <td className="py-2.5 pr-4 text-zinc-500 dark:text-zinc-400">
                      {user.email}
                    </td>
                    <td className="py-2.5 pr-4 text-zinc-500 dark:text-zinc-400">
                      {formatDate(user.memberSince.toISOString())}
                    </td>
                    <td className="py-2.5 pr-4 text-right tabular-nums text-zinc-500 dark:text-zinc-400">
                      {user._count.enrollments}
                    </td>
                    <td className="py-2.5 pr-4 text-right tabular-nums text-zinc-500 dark:text-zinc-400">
                      {user._count.certificates}
                    </td>
                    <td className="py-2.5 pr-4 text-right tabular-nums text-zinc-500 dark:text-zinc-400">
                      {user._count.quizAttempts}
                    </td>
                    <td className="py-2.5">
                      <ActionForm action={setUserRole} className="space-y-1">
                        <input type="hidden" name="userId" value={user.id} />
                        <input
                          type="hidden"
                          name="role"
                          value={user.role === "ADMIN" ? "USER" : "ADMIN"}
                        />
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={user.role === "ADMIN" ? "secondary" : "outline"}
                          >
                            {user.role}
                          </Badge>
                          {user.id === admin.id ? (
                            <span className="text-xs text-zinc-400">you</span>
                          ) : (
                            <Button type="submit" variant="ghost" size="sm">
                              Make {user.role === "ADMIN" ? "user" : "admin"}
                            </Button>
                          )}
                        </div>
                      </ActionForm>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Enrollments</CardTitle>
        </CardHeader>
        <CardContent>
          {enrollments.length === 0 ? (
            <p className="border-t border-zinc-100 pt-5 text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
              No enrollments yet.
            </p>
          ) : (
            <div className="overflow-x-auto border-t border-zinc-100 dark:border-zinc-800">
              <table className="w-full min-w-[40rem] text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-zinc-400">
                    <th className="py-2.5 pr-4 font-medium">Learner</th>
                    <th className="py-2.5 pr-4 font-medium">Course</th>
                    <th className="py-2.5 pr-4 text-right font-medium">Progress</th>
                    <th className="py-2.5 font-medium">Started</th>
                  </tr>
                </thead>
                <tbody>
                  {enrollments.map((enrollment) => (
                    <tr
                      key={enrollment.id}
                      className="border-t border-zinc-100 dark:border-zinc-800"
                    >
                      <td className="py-2.5 pr-4">
                        <span className="font-medium text-zinc-800 dark:text-zinc-200">
                          {enrollment.user.name}
                        </span>
                        <span className="ml-2 text-zinc-400">
                          {enrollment.user.email}
                        </span>
                      </td>
                      <td className="py-2.5 pr-4">
                        <Link
                          href={`/admin/courses/${enrollment.course.id}`}
                          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                        >
                          {enrollment.course.title}
                        </Link>
                      </td>
                      <td className="py-2.5 pr-4 text-right tabular-nums text-zinc-500 dark:text-zinc-400">
                        {enrollment.progress}%
                      </td>
                      <td className="py-2.5 text-zinc-500 dark:text-zinc-400">
                        {formatDate(enrollment.startedAt.toISOString())}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
