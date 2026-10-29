import { groups } from "./event";

export type RewardAnchor = { groupId: string; targetId: string };

/** Resolve existing public section, reward-card and checkbox fragments before changing filters. */
export function resolveRewardAnchor(hash: string): RewardAnchor | null {
  let targetId: string;
  try { targetId = decodeURIComponent(hash.startsWith("#") ? hash.slice(1) : hash); }
  catch { return null; }
  for (const group of groups) {
    if (targetId === `group-${group.id}` || group.entries.some(entry =>
      targetId === `reward-${entry.id}` || entry.checks.some(check => targetId === check.id))) {
      return { groupId: group.id, targetId };
    }
  }
  return null;
}
