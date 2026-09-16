import { useMemo, useState } from "react";
import { Shield } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/StatusBadge";
import { SimilarityIndicator } from "@/components/SimilarityIndicator";
import { AdminRequestDrawer } from "@/components/admin/AdminRequestDrawer";
import { useRequests } from "@/context/RequestsContext";
import { overlapLevel } from "@/lib/similarity";
import { getUserName } from "@/lib/data";
import { formatShortDate } from "@/lib/utils";
import type { TopicRequest } from "@/lib/types";

export default function AdminTopics() {
  const { requests } = useRequests();
  const [selected, setSelected] = useState<TopicRequest | null>(null);

  const rows = useMemo(
    () =>
      [...requests]
        .sort((a, b) => (a.submittedAt < b.submittedAt ? 1 : -1))
        .map((r) => ({ request: r, level: overlapLevel(r, requests).level })),
    [requests],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Topic Requests"
        subtitle="All requests across the creator program, with overlap flagged for faster review."
        actions={
          <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
            <Shield className="size-3.5" />
            Team view
          </span>
        }
      />

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Topic</TableHead>
              <TableHead className="w-36">Creator</TableHead>
              <TableHead className="w-24">Submitted</TableHead>
              <TableHead className="w-36">Status</TableHead>
              <TableHead className="w-32">Similarity</TableHead>
              <TableHead className="w-20 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map(({ request, level }) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">{request.title}</TableCell>
                <TableCell className="text-muted-foreground">
                  {getUserName(request.creatorId)}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatShortDate(request.submittedAt)}
                </TableCell>
                <TableCell>
                  <StatusBadge status={request.status} />
                </TableCell>
                <TableCell>
                  <SimilarityIndicator level={level} />
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelected(request)}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <AdminRequestDrawer
        request={selected}
        all={requests}
        open={selected !== null}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
