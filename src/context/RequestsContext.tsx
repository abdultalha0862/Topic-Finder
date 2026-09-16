import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { TopicRequest, TopicStatus } from "@/lib/types";
import { topicRequests as seedRequests, CURRENT_USER_ID, getUser } from "@/lib/data";

export interface NewRequestInput {
  title: string;
  description: string;
}

interface RequestsState {
  requests: TopicRequest[];
  currentUserId: string;
  currentUserName: string;
  myRequests: TopicRequest[];
  /**
   * The creator's currently pending request, if any. A creator may only have one
   * topic "Under Review" at a time, so this gates new submissions.
   */
  activeReview: TopicRequest | undefined;
  getById: (id: string) => TopicRequest | undefined;
  addRequest: (input: NewRequestInput) => TopicRequest;
}

const RequestsContext = createContext<RequestsState | undefined>(undefined);

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function RequestsProvider({ children }: { children: ReactNode }) {
  // Seed from mock data; new submissions are appended in-memory for the demo.
  const [requests, setRequests] = useState<TopicRequest[]>(() => [...seedRequests]);

  const addRequest = useCallback((input: NewRequestInput): TopicRequest => {
    const now = todayISO();
    const status: TopicStatus = "Under Review";
    const created: TopicRequest = {
      id: `req-${Date.now()}`,
      creatorId: CURRENT_USER_ID,
      title: input.title.trim(),
      description: input.description.trim(),
      status,
      submittedAt: now,
      updatedAt: now,
      timeline: [{ date: now, label: "Request submitted" }],
    };
    setRequests((prev) => [created, ...prev]);
    return created;
  }, []);

  const getById = useCallback(
    (id: string) => requests.find((r) => r.id === id),
    [requests],
  );

  const value = useMemo<RequestsState>(() => {
    const myRequests = requests
      .filter((r) => r.creatorId === CURRENT_USER_ID)
      .sort((a, b) => (a.submittedAt < b.submittedAt ? 1 : -1));
    const activeReview = myRequests.find((r) => r.status === "Under Review");
    return {
      requests,
      currentUserId: CURRENT_USER_ID,
      currentUserName: getUser(CURRENT_USER_ID)?.name ?? "Creator",
      myRequests,
      activeReview,
      getById,
      addRequest,
    };
  }, [requests, getById, addRequest]);

  return (
    <RequestsContext.Provider value={value}>{children}</RequestsContext.Provider>
  );
}

export function useRequests(): RequestsState {
  const ctx = useContext(RequestsContext);
  if (!ctx) throw new Error("useRequests must be used within RequestsProvider");
  return ctx;
}
