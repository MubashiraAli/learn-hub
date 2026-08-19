import Image from "next/image";
import type { ComponentType } from "react";
import {
  BrainCircuit,
  Cloud,
  Code2,
  Database,
  PenTool,
  ShieldCheck,
} from "lucide-react";
import type { Course, CourseCategory } from "@/types";
import { cn } from "@/lib/utils";

interface ThumbnailStyle {
  className: string;
  Icon: ComponentType<{ className?: string }>;
}

const categoryThumbnails: Record<CourseCategory, ThumbnailStyle> = {
  "web-development": { className: "from-sky-500 to-indigo-600", Icon: Code2 },
  ai: { className: "from-fuchsia-500 to-purple-600", Icon: BrainCircuit },
  "data-science": { className: "from-emerald-500 to-teal-600", Icon: Database },
  "cyber-security": { className: "from-rose-500 to-red-600", Icon: ShieldCheck },
  "ui-ux": { className: "from-amber-400 to-orange-500", Icon: PenTool },
  cloud: { className: "from-blue-500 to-cyan-600", Icon: Cloud },
};

export function CourseThumbnail({
  course,
  className,
}: {
  course: Course;
  className?: string;
}) {
  const thumbnail = categoryThumbnails[course.category];

  if (course.imageUrl) {
    return (
      <Image
        src={course.imageUrl}
        alt={`${course.title} cover`}
        fill
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className={cn("object-cover", className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center bg-gradient-to-br",
        thumbnail.className,
      )}
    >
      <thumbnail.Icon className="h-12 w-12 text-white/80" aria-hidden />
    </div>
  );
}
