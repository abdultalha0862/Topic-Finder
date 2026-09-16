/**
 * Core data model for the Topic Finder prototype.
 *
 * Creator identity is intentionally kept separate from topic request data so
 * that privacy rules (hide the creator from other creators) are easy to enforce
 * in the UI. When this is wired to a real backend, `TopicRequest` is what the
 * creator-facing API would return (without `creatorId`), while the admin API
 * would join in the `User`.
 */

export type TopicStatus =
  | "Under Review"
  | "Approved"
  | "In Progress"
  | "Published"
  | "Rejected";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "creator" | "admin";
}

export interface TopicRequest {
  id: string;
  creatorId: string;
  title: string;
  description: string;
  status: TopicStatus;
  submittedAt: string; // ISO date
  updatedAt: string; // ISO date
  publishedAt?: string; // ISO date
  reviewedAt?: string; // ISO date — when the team last reviewed (e.g. a rejection)
  /** Groups topics that are semantically related (mock clustering). */
  similarityGroup?: string;
  /** Mock timeline events shown on the request detail view. */
  timeline?: TimelineEvent[];
}

export interface TimelineEvent {
  date: string; // ISO date
  label: string;
}

/** Result of the mock similarity check. */
export type MatchType = "none" | "related" | "high";

export interface SimilarityMatch {
  request: TopicRequest;
  /** 0..1 similarity score. */
  score: number;
  matchType: MatchType;
}

export interface SimilarityResult {
  /** The strongest match type found across all candidates. */
  matchType: MatchType;
  /** Confidence of the strongest match (0..1). */
  confidence: number;
  /** Related matches, strongest first. */
  matches: SimilarityMatch[];
}

