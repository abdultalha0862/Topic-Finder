import { useCallback, useEffect, useRef, useState } from "react";
import { Search, ShieldCheck, AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { TopicFinderResult } from "@/components/topic-finder/TopicFinderResult";
import { PrivacyNote } from "@/components/PrivacyNote";
import { useRequests } from "@/context/RequestsContext";
import { checkTopicSimilarity } from "@/lib/similarity";
import type { SimilarityResult } from "@/lib/types";

type Phase = "idle" | "loading" | "result" | "error";

export default function TopicFinder() {
  const { requests, currentUserId } = useRequests();

  const [query, setQuery] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<SimilarityResult | null>(null);
  const [emptyError, setEmptyError] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const runCheck = useCallback(
    (raw: string) => {
      const q = raw.trim();
      if (!q) {
        setEmptyError(true);
        return;
      }
      setEmptyError(false);
      setPhase("loading");
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        if (q.toLowerCase() === "error") {
          setPhase("error");
          return;
        }
        setResult(
          checkTopicSimilarity(q, requests, { excludeCreatorId: currentUserId }),
        );
        setPhase("result");
      }, 900);
    },
    [requests, currentUserId],
  );

  const reset = () => {
    setQuery("");
    setResult(null);
    setPhase("idle");
    setEmptyError(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Topic Finder"
        subtitle="Check whether a topic is already being considered before you submit it."
      />

      <div className="rounded-lg border border-border bg-background p-5">
        <Label htmlFor="topic" className="text-sm">
          What's the topic you're planning to write about?
        </Label>
        <Textarea
          id="topic"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") runCheck(query);
          }}
          placeholder="Example: How to deploy PostgreSQL on Kubernetes"
          className="mt-2 min-h-[96px] text-[15px]"
        />
        {emptyError && (
          <p className="mt-2 flex items-center gap-1.5 text-sm text-rose-600">
            <AlertCircle className="size-4" />
            Enter a topic to check.
          </p>
        )}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <PrivacyNote text="You won't see who requested a topic." />
          <Button onClick={() => runCheck(query)} disabled={phase === "loading"}>
            {phase === "loading" ? (
              <>
                <Spinner /> Checking…
              </>
            ) : (
              <>
                <Search className="size-4" /> Check topic
              </>
            )}
          </Button>
        </div>
      </div>

      {phase === "loading" && (
        <div className="flex items-center gap-2 px-1 text-sm text-muted-foreground">
          <Spinner /> Checking topic availability…
        </div>
      )}

      {phase === "error" && (
        <div className="flex flex-col items-start gap-3 rounded-lg border border-rose-200 bg-rose-50/50 p-5">
          <p className="text-sm font-medium text-rose-700">
            Something went wrong while checking this topic.
          </p>
          <Button variant="secondary" onClick={() => runCheck(query)}>
            Try again
          </Button>
        </div>
      )}

      {phase === "result" && result && (
        <TopicFinderResult
          result={result}
          onReset={reset}
        />
      )}

      {phase === "idle" && (
        <p className="flex items-center gap-2 px-1 text-sm text-muted-foreground">
          <ShieldCheck className="size-4 text-muted-foreground" />
          Checking a topic is private and doesn't create a request.
        </p>
      )}
    </div>
  );
}
