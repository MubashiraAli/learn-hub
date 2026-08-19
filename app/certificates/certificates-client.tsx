"use client";

import { Award } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { SectionHeading } from "@/components/SectionHeading";
import { CertificateCard } from "@/components/CertificateCard";
import { EmptyState } from "@/components/ui";
import type { Course } from "@/types";

export function CertificatesClient({
  courses,
}: {
  courses: Record<string, Course>;
}) {
  const { user, certificates } = useAuth();

  const userName = user?.name ?? "there";

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <SectionHeading
        eyebrow="Achievements"
        title="Certificates"
        description={`Every certificate you have earned, ${userName}.`}
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {certificates.map((certificate) => {
          const course = courses[certificate.courseId];
          if (!course || !user) return null;
          return (
            <CertificateCard
              key={certificate.id}
              certificate={certificate}
              course={course}
              student={user}
            />
          );
        })}
      </div>

      {certificates.length === 0 ? (
        <EmptyState
          icon={<Award className="h-6 w-6" />}
          title="No certificates yet"
          description="Complete a course and pass its quiz to earn your first certificate."
          className="mt-8"
        />
      ) : null}
    </div>
  );
}
