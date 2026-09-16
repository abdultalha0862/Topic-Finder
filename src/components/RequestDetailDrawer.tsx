import { Clock } from "lucide-react";
import { Sheet } from "@/components/ui/sheet";
import { StatusBadge } from "@/components/StatusBadge";
import { Separator } from "@/components/ui/separator";
import { formatLongDate } from "@/lib/utils";
import type { TopicRequest } from "@/lib/types";

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm">{value}</dd>
    </div>
  );
}

export function RequestDetailDrawer({
  request,
  open,
  onClose,
}: {
  request: TopicRequest | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!request) return null;
  const timeline =
    request.timeline ??
    [{ date: request.submittedAt, label: "Request submitted" }];

  return (
    <Sheet open={open} onClose={onClose} title={request.title}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <StatusBadge status={request.status} />
        </div>

        {request.description && (
          <p className="text-sm text-muted-foreground">{request.description}</p>
        )}

        <dl className="grid grid-cols-2 gap-4">
          <Field label="Submitted" value={formatLongDate(request.submittedAt)} />
          <Field label="Last updated" value={formatLongDate(request.updatedAt)} />
          {request.publishedAt && (
            <Field label="Published" value={formatLongDate(request.publishedAt)} />
          )}
        </dl>

        <Separator />

        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Timeline</h3>
          <ol className="space-y-4">
            {timeline.map((event, i) => (
              <li key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span className="mt-1 size-2 rounded-full bg-primary" />
                  {i < timeline.length - 1 && (
                    <span className="mt-1 w-px flex-1 bg-border" />
                  )}
                </div>
                <div className="-mt-0.5 pb-1">
                  <p className="text-xs text-muted-foreground">
                    {formatLongDate(event.date)}
                  </p>
                  <p className="text-sm">{event.label}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {(request.status === "Under Review" ||
          request.status === "In Progress") && (
          <div className="flex items-start gap-2 rounded-md bg-muted/50 p-3 text-sm text-muted-foreground">
            <Clock className="mt-0.5 size-4 shrink-0" />
            <span>Expected review time: around 15 days</span>
          </div>
        )}
      </div>
    </Sheet>
  );
}
