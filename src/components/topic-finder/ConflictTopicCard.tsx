import { CalendarDays } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { PrivacyNote } from "@/components/PrivacyNote";
import { formatShortDate } from "@/lib/utils";
import type { SimilarityMatch } from "@/lib/types";

/**
 * Read-only view of an existing topic that overlaps with the creator's idea.
 * Deliberately shows only availability-relevant fields — never the creator.
 */
export function ConflictTopicCard({ match }: { match: SimilarityMatch }) {
  const { request } = match;
  return (
    <Card className="bg-muted/20">
      <CardContent className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Existing topic
            </p>
            <p className="font-medium leading-snug">{request.title}</p>
          </div>
          <StatusBadge status={request.status} />
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="size-3.5" />
            Submitted {formatShortDate(request.submittedAt)}
          </span>
          <PrivacyNote />
        </div>
      </CardContent>
    </Card>
  );
}
