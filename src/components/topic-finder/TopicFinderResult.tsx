import { CheckCircle2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PrivacyNote } from "@/components/PrivacyNote";
import type { SimilarityResult } from "@/lib/types";

interface Props {
  result: SimilarityResult;
  onReset: () => void;
}

// One question only: has another creator already requested a similar topic?
// The similarity engine already excludes the current creator, so any match at
// all means "yes". No match means the topic is available.
export function TopicFinderResult({ result, onReset }: Props) {
  const alreadyRequested = result.matches.length > 0;

  if (alreadyRequested) {
    return (
      <Card className="border-amber-200 bg-amber-50/50 animate-fade-in">
        <CardContent className="space-y-4 p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-600" />
            <div className="space-y-1">
              <p className="font-medium">Already requested by another creator</p>
              <p className="text-sm text-muted-foreground">
                A similar topic has already been requested by someone else in the
                program.
              </p>
            </div>
          </div>
          <PrivacyNote text="Creator information is hidden." />
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={onReset}>
              Check another topic
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-emerald-200 bg-emerald-50/40 animate-fade-in">
      <CardContent className="space-y-4 p-5">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" />
          <div className="space-y-1">
            <p className="font-medium text-emerald-800">
              Not requested — available
            </p>
            <p className="text-sm text-muted-foreground">
              No other creator has requested a similar topic.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={onReset}>
            Check another topic
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
