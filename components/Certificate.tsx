import type { Certificate, Course, User } from "@/types";
import { formatDate } from "@/lib/utils";

export function certificateCode(certificate: Certificate): string {
  const suffix = certificate.id.split("-").pop() ?? "0000";
  return `LH-${suffix.padStart(4, "0")}`;
}

export function certificateVerificationCode(certificate: Certificate): string {
  let hash = 0;
  const seed = `${certificate.courseId}:${certificate.issuedAt}:${certificate.id}`;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  const hex = Math.abs(hash).toString(16).toUpperCase().padStart(8, "0");
  return `LHV-${hex}`;
}

const serifFont = "Georgia, 'Times New Roman', serif";
const sansFont = "'Segoe UI', Arial, sans-serif";

export function CertificateSVG({
  certificate,
  course,
  student,
  className,
}: {
  certificate: Certificate;
  course: Course;
  student: User;
  className?: string;
}) {
  const code = certificateCode(certificate);
  const verificationCode = certificateVerificationCode(certificate);

  return (
    <svg
      viewBox="0 0 1000 700"
      width="1000"
      height="700"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={`Certificate of completion for ${course.title}`}
      className={className}
    >
      <rect width="1000" height="700" fill="#ffffff" />

      <rect
        x="24"
        y="24"
        width="952"
        height="652"
        fill="none"
        stroke="#c9a24b"
        strokeWidth="3"
      />
      <rect
        x="36"
        y="36"
        width="928"
        height="628"
        fill="none"
        stroke="#e5c877"
        strokeWidth="1.5"
      />
      <rect
        x="44"
        y="44"
        width="912"
        height="612"
        fill="none"
        stroke="#c9a24b"
        strokeWidth="1"
      />

      <path
        d="M 44 44 L 44 120 L 120 44 Z"
        fill="#4f46e5"
        opacity="0.12"
      />
      <path
        d="M 956 44 L 956 120 L 880 44 Z"
        fill="#4f46e5"
        opacity="0.12"
      />
      <path
        d="M 44 656 L 44 580 L 120 656 Z"
        fill="#4f46e5"
        opacity="0.12"
      />
      <path
        d="M 956 656 L 956 580 L 880 656 Z"
        fill="#4f46e5"
        opacity="0.12"
      />

      <text
        x="500"
        y="112"
        textAnchor="middle"
        fontSize="22"
        fontWeight="700"
        letterSpacing="8"
        fill="#4f46e5"
        fontFamily={sansFont}
      >
        LEARNHUB
      </text>

      <text
        x="500"
        y="168"
        textAnchor="middle"
        fontSize="36"
        fontWeight="700"
        fill="#18181b"
        fontFamily={serifFont}
      >
        Certificate of Completion
      </text>

      <line
        x1="330"
        y1="192"
        x2="670"
        y2="192"
        stroke="#c9a24b"
        strokeWidth="2"
      />

      <text
        x="500"
        y="248"
        textAnchor="middle"
        fontSize="15"
        letterSpacing="3"
        fill="#71717a"
        fontFamily={sansFont}
      >
        THIS CERTIFIES THAT
      </text>

      <text
        x="500"
        y="308"
        textAnchor="middle"
        fontSize="46"
        fontWeight="600"
        fontStyle="italic"
        fill="#18181b"
        fontFamily={serifFont}
      >
        {student.name}
      </text>

      <text
        x="500"
        y="346"
        textAnchor="middle"
        fontSize="14"
        fill="#71717a"
        fontFamily={sansFont}
      >
        has successfully completed the course
      </text>

      <text
        x="500"
        y="400"
        textAnchor="middle"
        fontSize="27"
        fontWeight="700"
        fill="#4f46e5"
        fontFamily={serifFont}
      >
        {course.title}
      </text>

      <text
        x="500"
        y="452"
        textAnchor="middle"
        fontSize="13"
        fill="#52525b"
        fontFamily={sansFont}
      >
        {`Certificate ID ${code}   ·   Completed ${formatDate(
          certificate.issuedAt,
        )}   ·   Score ${certificate.score}%`}
      </text>

      <text
        x="500"
        y="480"
        textAnchor="middle"
        fontSize="12"
        letterSpacing="1"
        fill="#a1a1aa"
        fontFamily={sansFont}
      >
        {`Verification code ${verificationCode}`}
      </text>

      <line x1="150" y1="560" x2="350" y2="560" stroke="#a1a1aa" strokeWidth="1" />
      <text
        x="250"
        y="588"
        textAnchor="middle"
        fontSize="13"
        fill="#71717a"
        fontFamily={sansFont}
      >
        LearnHub Academy
      </text>

      <circle cx="770" cy="540" r="34" fill="#f5f5f4" stroke="#c9a24b" strokeWidth="1.5" />
      <circle cx="770" cy="540" r="27" fill="none" stroke="#e5c877" strokeWidth="1" />
      <text
        x="770"
        y="556"
        textAnchor="middle"
        fontSize="26"
        fontWeight="700"
        fill="#4f46e5"
        fontFamily={sansFont}
      >
        LH
      </text>
    </svg>
  );
}

function svgToString(svgElement: SVGSVGElement): string {
  return new XMLSerializer().serializeToString(svgElement);
}

export async function downloadCertificatePng(
  svgElement: SVGSVGElement,
  filename: string,
): Promise<void> {
  const svgMarkup = svgToString(svgElement);
  const svgDataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
    svgMarkup,
  )}`;

  const image = new Image();
  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error("Failed to render certificate"));
    image.src = svgDataUrl;
  });

  const canvas = document.createElement("canvas");
  canvas.width = 1000;
  canvas.height = 700;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas not supported");
  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/png"),
  );
  if (!blob) throw new Error("Failed to encode certificate");

  triggerDownload(blob, filename);
}

export function downloadCertificateSvg(
  svgElement: SVGSVGElement,
  filename: string,
): void {
  const blob = new Blob([svgToString(svgElement)], {
    type: "image/svg+xml;charset=utf-8",
  });
  triggerDownload(blob, filename);
}

export function printCertificate(
  svgElement: SVGSVGElement,
  title: string,
): void {
  const windowRef = window.open("", "_blank", "width=1000,height=700");
  if (!windowRef) return;
  windowRef.document.write(
    `<!doctype html><html><head><title>${title}</title><style>` +
      "html,body{margin:0;padding:24px;display:flex;justify-content:center;align-items:center;background:#fafafa}" +
      "svg{width:100%;max-width:1000px;height:auto;box-shadow:0 4px 24px rgba(0,0,0,0.12)}" +
      "</style></head><body>" +
      svgToString(svgElement) +
      "</body></html>",
  );
  windowRef.document.close();
  windowRef.focus();
  window.setTimeout(() => windowRef.print(), 400);
}

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
