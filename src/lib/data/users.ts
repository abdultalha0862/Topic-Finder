import type { User } from "@/lib/types";

/**
 * Mock user directory. In a real integration this would come from the creator
 * program's identity service. Creator-facing views never read from here except
 * for the currently signed-in user.
 */
export const users: User[] = [
  { id: "u-alex", name: "Alex Morgan", email: "alex.morgan@example.com", role: "creator" },
  { id: "u-taylor", name: "Taylor Lee", email: "taylor.lee@example.com", role: "creator" },
  { id: "u-jordan", name: "Jordan Smith", email: "jordan.smith@example.com", role: "creator" },
  { id: "u-casey", name: "Casey Brooks", email: "casey.brooks@example.com", role: "creator" },
  { id: "u-riley", name: "Riley Nguyen", email: "riley.nguyen@example.com", role: "creator" },
  { id: "u-sam", name: "Sam Rivera", email: "sam.rivera@example.com", role: "admin" },
];

/** The creator whose dashboard we are viewing in the prototype. */
export const CURRENT_USER_ID = "u-alex";

export function getUser(id: string): User | undefined {
  return users.find((u) => u.id === id);
}

export function getUserName(id: string): string {
  return getUser(id)?.name ?? "Unknown";
}
