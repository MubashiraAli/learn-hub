import type { Metadata } from "next";
import { getAllCourses } from "@/lib/courses";
import { CertificatesClient } from "./certificates-client";

export const metadata: Metadata = {
  title: "Certificates",
};

export default async function CertificatesPage() {
  const courses = await getAllCourses();
  const lookup = Object.fromEntries(
    courses.map((course) => [course.id, course]),
  );
  return <CertificatesClient courses={lookup} />;
}
