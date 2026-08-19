import type { CourseCategory } from "@/types";

export interface CourseCategoryInfo {
  id: CourseCategory;
  label: string;
  description: string;
}

export const courseCategories: CourseCategoryInfo[] = [
  {
    id: "web-development",
    label: "Web Development",
    description:
      "Build fast, accessible web applications with modern frameworks and tools.",
  },
  {
    id: "ai",
    label: "Artificial Intelligence",
    description:
      "Understand machine learning, generative models, and LLM-powered products.",
  },
  {
    id: "data-science",
    label: "Data Science",
    description:
      "Turn raw data into insight with Python, statistics, and production ML.",
  },
  {
    id: "cyber-security",
    label: "Cyber Security",
    description:
      "Defend systems, networks, and applications against modern threats.",
  },
  {
    id: "ui-ux",
    label: "UI/UX",
    description:
      "Design intuitive interfaces and research-driven user experiences.",
  },
  {
    id: "cloud",
    label: "Cloud Computing",
    description:
      "Deploy, scale, and operate infrastructure on major cloud platforms.",
  },
];

export function getCategoryInfo(
  category: CourseCategory,
): CourseCategoryInfo {
  return (
    courseCategories.find((info) => info.id === category) ?? {
      id: category,
      label: category,
      description: "",
    }
  );
}

export function getCategoryLabel(category: CourseCategory): string {
  return getCategoryInfo(category).label;
}
