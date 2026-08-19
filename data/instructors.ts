import type { Instructor } from "@/types";

export const instructors: Instructor[] = [
  {
    id: "in-1",
    name: "Ayesha Khan",
    title: "Senior Frontend Engineer",
    bio: "Staff engineer building design systems for a global SaaS platform. Passionate about accessible, performant React and Next.js applications.",
    category: "web-development",
    rating: 4.8,
    studentsCount: 18400,
    coursesCount: 4,
  },
  {
    id: "in-2",
    name: "Bilal Ahmed",
    title: "AI Research Engineer",
    bio: "Researcher focused on large language models and applied generative AI. Previously shipped NLP features used by millions of users.",
    category: "ai",
    rating: 4.9,
    studentsCount: 22600,
    coursesCount: 3,
  },
  {
    id: "in-3",
    name: "Sara Malik",
    title: "Lead Data Scientist",
    bio: "Data scientist with a decade of experience in analytics, experimentation, and production machine learning across fintech.",
    category: "data-science",
    rating: 4.7,
    studentsCount: 31200,
    coursesCount: 5,
  },
  {
    id: "in-4",
    name: "Omar Farooq",
    title: "Offensive Security Consultant",
    bio: "Certified penetration tester and security architect. Runs bug bounty programs and teaches defensive and offensive security.",
    category: "cyber-security",
    rating: 4.8,
    studentsCount: 14700,
    coursesCount: 3,
  },
  {
    id: "in-5",
    name: "Hina Raza",
    title: "Principal Product Designer",
    bio: "Design leader who has shipped products for startups and Fortune 500s. Specializes in design systems, research, and accessibility.",
    category: "ui-ux",
    rating: 4.9,
    studentsCount: 25900,
    coursesCount: 4,
  },
  {
    id: "in-6",
    name: "Usman Tariq",
    title: "Cloud Solutions Architect",
    bio: "AWS and Azure certified architect with experience running large-scale, multi-region workloads for enterprise customers.",
    category: "cloud",
    rating: 4.6,
    studentsCount: 19800,
    coursesCount: 4,
  },
];

export function getInstructorById(id: string): Instructor | undefined {
  return instructors.find((instructor) => instructor.id === id);
}
