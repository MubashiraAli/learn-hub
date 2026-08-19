import type { Metadata } from "next";
import { getAllCourses } from "@/lib/courses";
import { CertificatesClient } from "./certificates-client";

export const metadata: Metadata = {
  title: "Certificates",
};

// Rendered on demand. The catalog is editable from /admin, so pages must
// reflect the current database rather than a build-time snapshot — and the
// build then needs no database connection at all.
export const dynamic = "force-dynamic";

export default async function CertificatesPage() {
  const courses = await getAllCourses();
  const lookup = Object.fromEntries(
    courses.map((course) => [course.id, course]),
  );
  return <CertificatesClient courses={lookup} />;
}
