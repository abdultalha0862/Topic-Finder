import type { TopicRequest } from "@/lib/types";
import { topicRequests } from "./requests";

export { topicRequests } from "./requests";
export { users, getUser, getUserName, CURRENT_USER_ID } from "./users";

export function getRequestById(id: string): TopicRequest | undefined {
  return topicRequests.find((r) => r.id === id);
}

export function getRequestsByIds(ids: string[]): TopicRequest[] {
  return ids
    .map((id) => topicRequests.find((r) => r.id === id))
    .filter((r): r is TopicRequest => Boolean(r));
}
