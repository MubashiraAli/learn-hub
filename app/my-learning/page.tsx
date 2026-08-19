import type { Metadata } from "next";
import { getAllCourses } from "@/lib/courses";
import { MyLearningClient } from "./my-learning-client";

export const metadata: Metadata = {
  title: "My Learning",
};

export default async function MyLearningPage() {
  const courses = await getAllCourses();
  return <MyLearningClient courses={courses} />;
}
