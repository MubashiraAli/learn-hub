"use client";

import { useRef, useState } from "react";
import { Award, BadgeCheck, Download, Printer, Eye } from "lucide-react";
import type { Certificate, Course, User } from "@/types";
import { getCategoryLabel } from "@/data/categories";
import { getInstructorById } from "@/data/instructors";
import { formatDate } from "@/lib/utils";
import { Badge, Button, Card, CardHeader, CardTitle } from "@/components/ui";
import { Modal } from "@/components/ui/Modal";
import {
  CertificateSVG,
  certificateCode,
  certificateVerificationCode,
  downloadCertificatePng,
  downloadCertificateSvg,
  printCertificate,
} from "@/components/Certificate";

export function CertificateCard({
  certificate,
  course,
  student,
}: {
  certificate: Certificate;
  course: Course;
  student: User;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const svgRef = useRef<HTMLDivElement>(null);

  const code = certificateCode(certificate);
  const verificationCode = certificateVerificationCode(certificate);
  const instructor = getInstructorById(course.instructorId);
  const filename = `learnhub-${course.id}-certificate.png`;

  async function handleDownload() {
    const svgElement = svgRef.current?.querySelector("svg");
    if (!svgElement) return;
    setIsDownloading(true);
    try {
      try {
        await downloadCertificatePng(svgElement, filename);
      } catch {
        downloadCertificateSvg(svgElement, filename.replace(/\.png$/, ".svg"));
      }
    } finally {
      setIsDownloading(false);
    }
  }

  function handlePrint() {
    const svgElement = svgRef.current?.querySelector("svg");
    if (!svgElement) return;
    printCertificate(svgElement, `${course.title} · Certificate`);
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
              <Award className="h-6 w-6" aria-hidden />
            </div>
            <Badge variant="success">Earned</Badge>
          </div>
          <CardTitle className="mt-4">{course.title}</CardTitle>
          <div className="mt-2 space-y-1 text-sm text-zinc-500 dark:text-zinc-400">
            <p>
              Issued {formatDate(certificate.issuedAt)} · Score{" "}
              {certificate.score}%
            </p>
            <p className="font-mono text-xs text-zinc-400">{code}</p>
          </div>
          <div className="mt-4">
            <Button
              variant="secondary"
              onClick={() => setIsOpen(true)}
              className="w-full"
            >
              <Eye className="h-4 w-4" aria-hidden />
              View certificate
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title="Certificate preview"
        description="Preview, download, or print your certificate."
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsOpen(false)}>
              Close
            </Button>
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="h-4 w-4" aria-hidden />
              Print / Save as PDF
            </Button>
            <Button onClick={handleDownload} isLoading={isDownloading}>
              <Download className="h-4 w-4" aria-hidden />
              Download
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <div className="overflow-hidden rounded-lg bg-zinc-100 ring-1 ring-zinc-200 dark:bg-zinc-800 dark:ring-zinc-700">
            <div ref={svgRef}>
              <CertificateSVG
                certificate={certificate}
                course={course}
                student={student}
                className="h-auto w-full"
              />
            </div>
          </div>

          <dl className="grid grid-cols-1 gap-x-6 gap-y-3 rounded-lg border border-zinc-200 p-4 text-sm sm:grid-cols-2 dark:border-zinc-800">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                Student
              </dt>
              <dd className="mt-0.5 font-medium text-zinc-900 dark:text-zinc-50">
                {student.name}
              </dd>
              <dd className="text-zinc-500 dark:text-zinc-400">
                {student.email}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                Course
              </dt>
              <dd className="mt-0.5 font-medium text-zinc-900 dark:text-zinc-50">
                {course.title}
              </dd>
              <dd className="text-zinc-500 dark:text-zinc-400">
                {getCategoryLabel(course.category)}
                {instructor ? ` · ${instructor.name}` : ""}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                Completed
              </dt>
              <dd className="mt-0.5 font-medium text-zinc-900 dark:text-zinc-50">
                {formatDate(certificate.issuedAt)}
              </dd>
              <dd className="text-zinc-500 dark:text-zinc-400">
                Final score {certificate.score}%
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                Certificate ID
              </dt>
              <dd className="mt-0.5 flex items-center gap-1.5 font-medium text-zinc-900 dark:text-zinc-50">
                <BadgeCheck className="h-4 w-4 text-emerald-500" aria-hidden />
                {code}
              </dd>
              <dd className="font-mono text-xs text-zinc-400">
                {verificationCode}
              </dd>
            </div>
          </dl>
        </div>
      </Modal>
    </>
  );
}
