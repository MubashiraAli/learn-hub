import { cn } from "@/lib/utils";

interface ComparisonTableProps {
  columns: string[];
  rows: string[][];
  className?: string;
}

export function ComparisonTable({ columns, rows, className }: ComparisonTableProps) {
  return (
    <div className={cn("overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800", className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
            {columns.map((col) => (
              <th
                key={col}
                className="px-4 py-3 text-left font-semibold text-zinc-800 dark:text-zinc-200"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={cn(
                "border-b border-zinc-100 last:border-0 dark:border-zinc-800/60",
                rowIndex % 2 === 0
                  ? "bg-white dark:bg-zinc-950"
                  : "bg-zinc-50/50 dark:bg-zinc-900/50",
              )}
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className={cn(
                    "px-4 py-3 text-zinc-600 dark:text-zinc-400",
                    cellIndex === 0 && "font-medium text-zinc-800 dark:text-zinc-200",
                  )}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
