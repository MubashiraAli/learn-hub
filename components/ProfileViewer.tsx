"use client";

import { useMemo, useState, type ComponentType } from "react";
import { useRouter } from "next/navigation";
import {
  Award,
  BookOpenCheck,
  CalendarDays,
  CheckCircle2,
  Clock,
  GraduationCap,
  LogOut,
  Mail,
  MapPin,
  Pencil,
  RotateCcw,
  Sparkles,
  Phone,
  Globe,
} from "lucide-react";
import type { User } from "@/types";
import { useLearningProgress } from "@/hooks";
import { useAuth } from "@/hooks/use-auth";
import { formatDate, formatDuration } from "@/lib/utils";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, StorageWarning } from "@/components/ui";
import { Input, Label, Modal, Textarea } from "@/components/ui";

interface ProfileViewerProps {
  courseTitles: Record<string, string>;
  lessonDurations: Record<string, Record<string, number>>;
}

type ActivityType = "certificate" | "lesson" | "enrollment";

const activityIcons: Record<ActivityType, ComponentType<{ className?: string }>> = {
  certificate: Award,
  lesson: BookOpenCheck,
  enrollment: GraduationCap,
};

const activityIconClasses: Record<ActivityType, string> = {
  certificate: "bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
  lesson: "bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400",
  enrollment: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400",
};

function EditProfileForm({
  user,
  onSave,
  onCancel,
  onReset,
}: {
  user: User;
  onSave: (updates: Partial<User>) => void;
  onCancel: () => void;
  onReset: () => void;
}) {
  const [form, setForm] = useState({
    name: user.name ?? "",
    title: user.title ?? "",
    email: user.email ?? "",
    phone: user.phone ?? "",
    address: user.address ?? "",
    city: user.city ?? "",
    state: user.state ?? "",
    country: user.country ?? "",
    bio: user.bio ?? "",
    avatarUrl: user.avatarUrl ?? "",
    skillsText: (user.skills ?? []).join(", "),
  });
  const [error, setError] = useState("");

  function handleSave() {
    const name = form.name.trim();
    const email = form.email.trim();
    if (!name) {
      setError("Please enter your name.");
      return;
    }
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    const skills = Array.from(
      new Set(
        form.skillsText
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
      ),
    );
    onSave({
      name,
      email,
      title: form.title.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      country: form.country.trim(),
      bio: form.bio.trim(),
      avatarUrl: form.avatarUrl.trim(),
      skills,
    });
  }

  return (
    <Modal
      open
      onClose={onCancel}
      title="Edit profile"
      description="Changes are saved to your account."
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onReset}>
            <RotateCcw className="h-4 w-4" aria-hidden />
            Reset
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save changes</Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="profile-name">Full name</Label>
            <Input
              id="profile-name"
              value={form.name}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, name: event.target.value }))
              }
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="profile-title">Headline</Label>
            <Input
              id="profile-title"
              value={form.title}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, title: event.target.value }))
              }
              placeholder="e.g. Frontend Engineer"
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="profile-email">Email</Label>
            <Input
              id="profile-email"
              type="email"
              value={form.email}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, email: event.target.value }))
              }
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="profile-phone">Phone number</Label>
            <Input
              id="profile-phone"
              type="tel"
              value={form.phone}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, phone: event.target.value }))
              }
              placeholder="e.g. +92 300 1234567"
              className="mt-1.5"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="profile-avatar">Profile photo</Label>
          <div className="mt-1.5 flex items-center gap-3">
            {form.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={form.avatarUrl}
                alt=""
                className="h-10 w-10 shrink-0 rounded-full object-cover"
              />
            ) : (
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-medium text-white">
                {(form.name || "?").charAt(0).toUpperCase()}
              </span>
            )}
            <Input
              id="profile-avatar"
              type="url"
              value={form.avatarUrl}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, avatarUrl: event.target.value }))
              }
              placeholder="https://example.com/photo.jpg"
            />
          </div>
          <p className="mt-1.5 text-xs text-zinc-400">
            Paste a link to an image. Leave blank to use your initial.
          </p>
        </div>

        <div>
          <Label htmlFor="profile-address">Street address</Label>
          <Input
            id="profile-address"
            value={form.address}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, address: event.target.value }))
            }
            placeholder="e.g. 123 Main Street"
            className="mt-1.5"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="profile-city">City</Label>
            <Input
              id="profile-city"
              value={form.city}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, city: event.target.value }))
              }
              placeholder="e.g. Lahore"
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="profile-state">State / Province</Label>
            <Input
              id="profile-state"
              value={form.state}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, state: event.target.value }))
              }
              placeholder="e.g. Punjab"
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="profile-country">Country</Label>
            <Input
              id="profile-country"
              value={form.country}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, country: event.target.value }))
              }
              placeholder="e.g. Pakistan"
              className="mt-1.5"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="profile-bio">Bio</Label>
          <Textarea
            id="profile-bio"
            value={form.bio}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, bio: event.target.value }))
            }
            rows={3}
            placeholder="Tell others a little about yourself..."
            className="mt-1.5"
          />
        </div>

        <div>
          <Label htmlFor="profile-skills">Skills</Label>
          <Input
            id="profile-skills"
            value={form.skillsText}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, skillsText: event.target.value }))
            }
            placeholder="React, Next.js, TypeScript"
            className="mt-1.5"
          />
          <p className="mt-1.5 text-xs text-zinc-400">
            Separate skills with commas.
          </p>
        </div>

        {error ? (
          <p className="text-sm font-medium text-red-600 dark:text-red-400">
            {error}
          </p>
        ) : null}
      </div>
    </Modal>
  );
}

export function ProfileViewer({
  courseTitles,
  lessonDurations,
}: ProfileViewerProps) {
  const { user, logout, updateProfile, certificates: rawCertificates } = useAuth();
  const { progress, storageError } = useLearningProgress(user?.id ?? null);
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const certificates = rawCertificates.map((cert) => ({
    ...cert,
    courseTitle: courseTitles[cert.courseId] ?? "Course",
  }));

  const completedLessons = Object.values(progress.courses).reduce(
    (total, courseProgress) => total + courseProgress.completedLessonIds.length,
    0,
  );
  const learnedMinutes = Object.entries(progress.courses).reduce(
    (total, [courseId, courseProgress]) => {
      const durations = lessonDurations[courseId] ?? {};
      return (
        total +
        courseProgress.completedLessonIds.reduce(
          (sum, lessonId) => sum + (durations[lessonId] ?? 0),
          0,
        )
      );
    },
    0,
  );

  const locationParts = [user?.address, user?.city, user?.state, user?.country].filter(Boolean);
  const locationString = locationParts.join(", ");

  const stats = user ? [
    {
      label: "Enrolled courses",
      value: user.enrolledCourseIds.length,
      Icon: BookOpenCheck,
    },
    {
      label: "Certificates",
      value: certificates.length,
      Icon: Award,
    },
    {
      label: "Lessons completed",
      value: completedLessons,
      Icon: CheckCircle2,
    },
    {
      label: "Hours learned",
      value: formatDuration(learnedMinutes / 60),
      Icon: Clock,
    },
    {
      label: "Skills",
      value: (user.skills ?? []).length,
      Icon: Sparkles,
    },
    {
      label: "Member since",
      value: user.memberSince ? new Date(user.memberSince).getFullYear() : "—",
      Icon: CalendarDays,
    },
  ] : [];

  const activity = useMemo(() => {
    if (!user) return [];
    const items: {
      id: string;
      type: ActivityType;
      title: string;
      description: string;
      createdAt: string;
    }[] = [
      ...certificates.map((certificate) => ({
        id: `certificate-${certificate.id}`,
        type: "certificate" as const,
        title: certificate.courseTitle,
        description: `Earned a certificate with a score of ${certificate.score}%`,
        createdAt: certificate.issuedAt,
      })),
      ...Object.entries(progress.courses).map(([courseId, courseProgress]) => ({
        id: `course-${courseId}`,
        type: "lesson" as const,
        title: courseTitles[courseId] ?? courseId,
        description: `${courseProgress.completedLessonIds.length} lessons completed`,
        createdAt: courseProgress.lastAccessedAt,
      })),
      {
        id: "joined",
        type: "enrollment" as const,
        title: "LearnHub",
        description: "Joined LearnHub and started learning",
        createdAt: user.memberSince ?? new Date().toISOString(),
      },
    ];
    return items
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 6);
  }, [certificates, progress, courseTitles, user]);

  if (!user) return null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
            Account
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Profile
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setIsEditing(true)}>
            <Pencil className="h-4 w-4" aria-hidden />
            Edit profile
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              void (async () => {
                await logout();
                router.replace("/login");
              })();
            }}
          >
            <LogOut className="h-4 w-4" aria-hidden />
            Log out
          </Button>
        </div>
      </div>

      {storageError ? (
        <div className="mt-4">
          <StorageWarning label="Your changes couldn't be saved right now." />
        </div>
      ) : null}

      <div className="mt-8 space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={`${user.name}'s avatar`}
                  className="h-20 w-20 shrink-0 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-2xl font-semibold text-white">
                  {(user.name ?? "?").charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                  {user.name}
                </h2>
                {user.title ? (
                  <p className="mt-0.5 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    {user.title}
                  </p>
                ) : null}
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-zinc-500 dark:text-zinc-400">
                  <span className="inline-flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5" aria-hidden />
                    {user.email}
                  </span>
                  {user.phone ? (
                    <span className="inline-flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5" aria-hidden />
                      {user.phone}
                    </span>
                  ) : null}
                  {locationString ? (
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" aria-hidden />
                      {locationString}
                    </span>
                  ) : null}
                  {user.country && !locationString ? (
                    <span className="inline-flex items-center gap-1.5">
                      <Globe className="h-3.5 w-3.5" aria-hidden />
                      {user.country}
                    </span>
                  ) : null}
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" aria-hidden />
                    Joined {user.memberSince ? formatDate(user.memberSince) : "—"}
                  </span>
                </div>
                {user.bio ? (
                  <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                    {user.bio}
                  </p>
                ) : null}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Learning statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-6 border-t border-zinc-100 pt-6 sm:grid-cols-2 lg:grid-cols-3 dark:border-zinc-800">
              {stats.map(({ label, value, Icon }) => (
                <div key={label}>
                  <dt className="flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400">
                    <Icon className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" aria-hidden />
                    {label}
                  </dt>
                  <dd className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Skills</CardTitle>
          </CardHeader>
          <CardContent>
            {(user.skills ?? []).length > 0 ? (
              <div className="flex flex-wrap gap-2 border-t border-zinc-100 pt-6 dark:border-zinc-800">
                {user.skills!.map((skill) => (
                  <Badge key={skill} variant="secondary" className="px-3 py-1">
                    {skill}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="border-t border-zinc-100 pt-6 text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                Add skills to your profile to showcase what you know.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-5 border-t border-zinc-100 pt-6 dark:border-zinc-800">
              {activity.map((item) => {
                const Icon = activityIcons[item.type];
                return (
                  <li key={item.id} className="flex items-start gap-3">
                    <div
                      className={
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full " +
                        activityIconClasses[item.type]
                      }
                    >
                      <Icon className="h-4 w-4" aria-hidden />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-50">
                        {item.title}
                      </p>
                      <p className="truncate text-sm text-zinc-500 dark:text-zinc-400">
                        {item.description}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs text-zinc-400">
                      {formatDate(item.createdAt)}
                    </span>
                  </li>
                );
              })}
            </ol>
          </CardContent>
        </Card>
      </div>

      {isEditing ? (
        <EditProfileForm
          user={user}
          onCancel={() => setIsEditing(false)}
          onSave={(updates) => {
            void updateProfile(updates).then(() => setIsEditing(false));
          }}
          onReset={() => {
            void updateProfile({
              name: user.name,
              title: "",
              phone: "",
              address: "",
              city: "",
              state: "",
              country: "",
              bio: "",
              avatarUrl: "",
              skills: [],
            }).then(() => setIsEditing(false));
          }}
        />
      ) : null}
    </div>
  );
}
