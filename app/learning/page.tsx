import { redirect } from "next/navigation";

export default async function LearningPage({
  searchParams,
}: PageProps<"/learning">) {
  const courseId = (await searchParams).course;
  if (typeof courseId === "string" && courseId) {
    redirect(`/learn/${courseId}`);
  }
  redirect("/courses");
}
