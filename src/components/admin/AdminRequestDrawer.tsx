import { CalendarDays, User } from "lucide-react";
import { Sheet } from "@/components/ui/sheet";
import { StatusBadge } from "@/components/StatusBadge";
import { Separator } from "@/components/ui/separator";
import { SimilarityIndicator } from "@/components/SimilarityIndicator";
import { checkTopicSimilarity, overlapLevel } from "@/lib/similarity";
import { getUserName } from "@/lib/data";
import { formatShortDate } from "@/lib/utils";
import type { TopicRequest } from "@/lib/types";

export function AdminRequestDrawer({
  request,
  all,
  open,
  onClose,
}: {
  request: TopicRequest | null;
  all: TopicRequest[];
  open: boolean;
  onClose: () => void;
}) {
  if (!request) return null;

  // Admins DO see creator info, so no exclusion here — just skip the item itself.
  const others = all.filter((r) => r.id !== request.id);
  const { matches } = checkTopicSimilarity(request.title, others, { threshold: 0.3 });
  const { level } = overlapLevel(request, all);

  return (
    <Sheet open={open} onClose={onClose} title="Topic request">
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Submitted topic
          </p>
          <p className="font-medium leading-snug">{request.title}</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <User className="size-3.5" />
              {getUserName(request.creatorId)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-3.5" />
              {formatShortDate(request.submittedAt)}
            </span>
            <StatusBadge status={request.status} />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-md border border-border bg-muted/30 px-3 py-2.5">
          <span className="text-sm text-muted-foreground">Potential overlap</span>
          <SimilarityIndicator level={level} />
        </div>

        <Separator />

        <div className="space-y-3">
          <h3 className="text-sm font-semibold">
            Potential matches{" "}
            <span className="font-normal text-muted-foreground">
              ({matches.length})
            </span>
          </h3>
          {matches.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No overlapping topics found in the registry.
            </p>
          ) : (
            <ul className="space-y-2">
              {matches.map((m) => (
                <li
                  key={m.request.id}
                  className="rounded-md border border-border bg-background p-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-medium leading-snug">
                      {m.request.title}
                    </p>
                    <StatusBadge status={m.request.status} />
                  </div>
                  <div className="mt-1.5 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <User className="size-3.5" />
                      {getUserName(m.request.creatorId)}
                    </span>
                    <span>{Math.round(m.score * 100)}% overlap</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Sheet>
  );
}
