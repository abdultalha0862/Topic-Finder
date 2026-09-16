import { Badge, type BadgeProps } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { TopicStatus } from "@/lib/types";

const STATUS_STYLE: Record<
  TopicStatus,
  { variant: BadgeProps["variant"]; dot: string }
> = {
  "Under Review": { variant: "amber", dot: "bg-amber-500" },
  Approved: { variant: "emerald", dot: "bg-emerald-500" },
  "In Progress": { variant: "blue", dot: "bg-blue-500" },
  Published: { variant: "violet", dot: "bg-violet-500" },
  Rejected: { variant: "rose", dot: "bg-rose-500" },
};

export function StatusBadge({
  status,
  className,
}: {
  status: TopicStatus;
  className?: string;
}) {
  const style = STATUS_STYLE[status];
  return (
    <Badge variant={style.variant} className={className}>
      <span className={cn("size-1.5 rounded-full", style.dot)} />
      {status}
    </Badge>
  );
}
