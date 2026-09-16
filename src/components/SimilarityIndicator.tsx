import { cn } from "@/lib/utils";

type Level = "High" | "Medium" | "Low";

const LEVEL_META: Record<Level, { label: string; bar: string; text: string; fill: number }> = {
  High: { label: "High", bar: "bg-amber-500", text: "text-amber-700", fill: 3 },
  Medium: { label: "Medium", bar: "bg-blue-500", text: "text-blue-700", fill: 2 },
  Low: { label: "Low", bar: "bg-slate-400", text: "text-muted-foreground", fill: 1 },
};

/**
 * Compact three-segment meter for admins to gauge topic overlap at a glance.
 * Intentionally simple — not a machine-learning readout.
 */
export function SimilarityIndicator({
  level,
  className,
  showLabel = true,
}: {
  level: Level;
  className?: string;
  showLabel?: boolean;
}) {
  const meta = LEVEL_META[level];
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center gap-0.5" aria-hidden>
        {[1, 2, 3].map((i) => (
          <span
            key={i}
            className={cn(
              "h-3.5 w-1.5 rounded-sm",
              i <= meta.fill ? meta.bar : "bg-muted",
            )}
          />
        ))}
      </div>
      {showLabel && (
        <span className={cn("text-sm font-medium", meta.text)}>{meta.label}</span>
      )}
    </div>
  );
}
