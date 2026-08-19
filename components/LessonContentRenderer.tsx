import type { LessonContent } from "@/types";
import { cn } from "@/lib/utils";
import { AlertTriangle, Info, Lightbulb } from "lucide-react";
import { AwsArchitectureDiagram } from "@/components/AwsArchitectureDiagram";
import { ComparisonTable } from "@/components/ComparisonTable";
import { InlineQuiz } from "@/components/InlineQuiz";

const calloutStyles = {
  info: {
    container: "border-blue-200 bg-blue-50/50 dark:border-blue-900/50 dark:bg-blue-950/30",
    icon: "text-blue-500",
    Icon: Info,
  },
  tip: {
    container: "border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/50 dark:bg-emerald-950/30",
    icon: "text-emerald-500",
    Icon: Lightbulb,
  },
  warning: {
    container: "border-amber-200 bg-amber-50/50 dark:border-amber-900/50 dark:bg-amber-950/30",
    icon: "text-amber-500",
    Icon: AlertTriangle,
  },
} as const;

const diagramComponents: Record<string, React.ComponentType<{ className?: string }>> = {
  "aws-region-az-edge": AwsArchitectureDiagram,
};

interface LessonContentRendererProps {
  content: LessonContent;
  className?: string;
}

export function LessonContentRenderer({ content, className }: LessonContentRendererProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {content.map((block, index) => {
        switch (block.type) {
          case "heading":
            return (
              <h3
                key={index}
                className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100"
              >
                {block.text}
              </h3>
            );

          case "paragraph":
            return (
              <p
                key={index}
                className="text-sm leading-7 text-zinc-600 dark:text-zinc-400"
              >
                {block.text}
              </p>
            );

          case "list":
            return (
              <ul key={index} className="space-y-2 pl-1">
                {block.items?.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
                    {item}
                  </li>
                ))}
              </ul>
            );

          case "callout": {
            const variant = block.variant ?? "info";
            const style = calloutStyles[variant];
            return (
              <div
                key={index}
                className={cn(
                  "flex gap-3 rounded-xl border p-4",
                  style.container,
                )}
              >
                <style.Icon
                  className={cn("mt-0.5 h-5 w-5 shrink-0", style.icon)}
                  aria-hidden
                />
                <p className="text-sm leading-6 text-zinc-700 dark:text-zinc-300">
                  {block.text}
                </p>
              </div>
            );
          }

          case "diagram": {
            const Diagram = block.diagramId ? diagramComponents[block.diagramId] : undefined;
            return Diagram ? (
              <div key={index} className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                <Diagram />
              </div>
            ) : null;
          }

          case "table":
            return block.columns && block.rows ? (
              <ComparisonTable
                key={index}
                columns={block.columns}
                rows={block.rows}
              />
            ) : null;

          case "quiz":
            return block.questions ? (
              <InlineQuiz key={index} questions={block.questions} />
            ) : null;

          default:
            return null;
        }
      })}
    </div>
  );
}
