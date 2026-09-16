import type {
  MatchType,
  SimilarityMatch,
  SimilarityResult,
  TopicRequest,
} from "@/lib/types";

/**
 * Mock topic-similarity engine.
 *
 * This is deliberately simple: a weighted token-overlap (Jaccard) score with
 * light normalization and domain synonyms. It is NOT machine learning — it is a
 * placeholder that recognizes that "Deploy PostgreSQL on Kubernetes" and
 * "Running PostgreSQL in a Kubernetes Cluster" describe the same topic.
 *
 * To move to real semantic search later, replace `scorePair` (and only that)
 * with an embeddings-based cosine similarity. The public API stays the same.
 */

const STOPWORDS = new Set([
  "how", "to", "a", "an", "the", "on", "in", "with", "of", "for", "and", "or",
  "using", "use", "guide", "your", "you", "self", "inside", "into", "up", "set",
  "setting", "get", "getting", "started", "start", "introduction", "intro", "by",
  "from", "at", "is", "are", "this", "that", "step", "steps",
]);

// Map surface tokens onto a shared canonical token.
const SYNONYMS: Record<string, string> = {
  postgresql: "postgres", psql: "postgres", pg: "postgres",
  k8s: "kubernetes", kube: "kubernetes",
  running: "deploy", run: "deploy", deploying: "deploy", deployment: "deploy",
  deployments: "deploy", host: "deploy", hosting: "deploy", selfhost: "deploy",
  monitoring: "monitor", observability: "monitor", scaling: "scale",
  applications: "app", application: "app", apps: "app",
  clusters: "cluster", containers: "container",
};

// Platform / infrastructure tokens: shared context, but not the distinguishing
// subject of a topic. They carry some weight, yet never make two topics "match"
// on their own.
const PLATFORM = new Set([
  "kubernetes", "docker", "cluster", "container", "cloud", "compose",
]);

// Generic action words. After synonym folding, verbs like "deploy" / "monitor"
// collapse here. Low weight and — like platform tokens — not enough to match on.
const GENERIC = new Set([
  "deploy", "monitor", "scale", "build", "setup", "install", "manage",
  "migrate", "optimize", "secure", "automate", "configure", "create",
]);

// Category / boilerplate descriptors. Creators tend to reuse the same title
// template — e.g. "How to deploy <X>, an open-source <category> platform/tool".
// Words like "open", "source", "platform", "tool", or "management" describe the
// *shape* of the title, not its subject, so they must never make two topics
// match on their own. "Deploy Affine … open source management platform" and
// "Deploy Uptime Kuma … open source monitoring tool" share every boilerplate
// word yet are completely different topics.
const DESCRIPTOR = new Set([
  "open", "source", "opensource", "platform", "tool", "tools", "tooling",
  "solution", "solutions", "software", "system", "systems", "service",
  "services", "suite", "dashboard", "management", "app",
]);

// Any other token is a "content" token — the real subject (postgres, redis,
// grafana, rabbitmq, affine, uptime, kuma, …). These weigh the most, and two
// topics only count as related when they share at least one of them.
function weightOf(token: string): number {
  if (GENERIC.has(token) || DESCRIPTOR.has(token)) return 1;
  if (PLATFORM.has(token)) return 2;
  return 5;
}

function isContent(token: string): boolean {
  return (
    !GENERIC.has(token) && !DESCRIPTOR.has(token) && !PLATFORM.has(token)
  );
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    // Drop pure-numeric tokens (e.g. "26"/"04" from "Ubuntu 26.04", "2"/"0"
    // from "OAuth 2.0") so version numbers never act as content tokens.
    .filter((t) => !/^[0-9]+$/.test(t))
    .map((t) => SYNONYMS[t] ?? t)
    .filter((t) => !STOPWORDS.has(t));
}

/**
 * Weighted Jaccard similarity between two topic titles, 0..1.
 *
 * Guard rail: the titles must share at least one *content* token (the actual
 * subject). This prevents matches that only overlap on platform/action words —
 * e.g. "Deploy RabbitMQ on Kubernetes" vs "Zero-downtime Deployments on
 * Kubernetes" — which are unrelated despite sharing "deploy" and "kubernetes".
 */
function scorePair(a: string, b: string): number {
  const tokensA = tokenize(a);
  const setA = new Set(tokensA);
  const setB = new Set(tokenize(b));
  if (setA.size === 0 || setB.size === 0) return 0;

  const sharesContent = tokensA.some((t) => isContent(t) && setB.has(t));
  if (!sharesContent) return 0;

  let interW = 0;
  let unionW = 0;
  const seen = new Set<string>();
  for (const t of setA) {
    seen.add(t);
    unionW += weightOf(t);
    if (setB.has(t)) interW += weightOf(t);
  }
  for (const t of setB) {
    if (!seen.has(t)) unionW += weightOf(t);
  }
  return unionW === 0 ? 0 : interW / unionW;
}

export function classify(score: number): MatchType {
  if (score >= 0.6) return "high";
  if (score >= 0.35) return "related";
  return "none";
}

export interface CheckOptions {
  /** Exclude this creator's own requests from results (creator-facing search). */
  excludeCreatorId?: string;
  /** Minimum score to include a topic as a "match". */
  threshold?: number;
}

/**
 * Compare an input topic against the existing registry.
 * Returns the overall match type, confidence, and the matching topics.
 */
export function checkTopicSimilarity(
  input: string,
  existing: TopicRequest[],
  options: CheckOptions = {},
): SimilarityResult {
  const { excludeCreatorId, threshold = 0.35 } = options;
  const query = input.trim();
  if (!query) return { matchType: "none", confidence: 0, matches: [] };

  const matches: SimilarityMatch[] = existing
    .filter((r) => r.creatorId !== excludeCreatorId)
    .map((request) => {
      const score = scorePair(query, request.title);
      return { request, score, matchType: classify(score) };
    })
    .filter((m) => m.score >= threshold)
    .sort((a, b) => b.score - a.score);

  const confidence = matches[0]?.score ?? 0;
  return { matchType: classify(confidence), confidence, matches };
}

/** Admin helper: how much a request overlaps with the rest of the registry. */
export function overlapLevel(
  request: TopicRequest,
  all: TopicRequest[],
): { level: "High" | "Medium" | "Low"; score: number } {
  let top = 0;
  for (const other of all) {
    if (other.id === request.id) continue;
    top = Math.max(top, scorePair(request.title, other.title));
  }
  const level = top >= 0.6 ? "High" : top >= 0.35 ? "Medium" : "Low";
  return { level, score: top };
}
