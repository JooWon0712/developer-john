import { guardianCards } from "./collectibles";
import { gamescomPromotion, rewards } from "./rewards";

const collection = "echoes-of-central-park-2026";
const schemaVersion = 1;
const validIds = new Set([...rewards, ...guardianCards, ...gamescomPromotion.items].map(item => item.id));

export const storageKey = `developer-john:division2:${collection}:v${schemaVersion}`;
export const maxBackupBytes = 256 * 1024;

type StoredProgress = {
  checked: string[];
  mode: "ready" | "unavailable" | "corrupt";
};

function knownChecks(checked: readonly string[]): string[] {
  return [...new Set(checked.filter(id => validIds.has(id)))];
}

export function parseBackup(raw: string): string[] {
  if (raw.length > maxBackupBytes || new TextEncoder().encode(raw).byteLength > maxBackupBytes) {
    throw new Error("Central Park backup exceeds 256 KiB.");
  }

  const record: unknown = JSON.parse(raw.replace(/^\uFEFF/, ""));
  if (typeof record !== "object" || record === null || Array.isArray(record)) {
    throw new Error("Invalid Central Park backup.");
  }

  const value = record as Record<string, unknown>;
  if (value.collection !== collection || value.schemaVersion !== schemaVersion ||
      !Array.isArray(value.checked) || !value.checked.every(id => typeof id === "string")) {
    throw new Error("Invalid Central Park backup.");
  }

  // Restore explicit checks from the prototype and ignore its personal receipt migrations.
  return knownChecks(value.checked);
}

export function serializeBackup(checked: readonly string[]): string {
  return JSON.stringify({ schemaVersion, collection, checked: knownChecks(checked) });
}

export function loadProgress(storage: Pick<Storage, "getItem">): StoredProgress {
  let raw: string | null;
  try {
    raw = storage.getItem(storageKey);
  } catch {
    return { checked: [], mode: "unavailable" };
  }

  if (raw === null) return { checked: [], mode: "ready" };
  try {
    return { checked: parseBackup(raw), mode: "ready" };
  } catch {
    return { checked: [], mode: "corrupt" };
  }
}

export function saveProgress(storage: Pick<Storage, "setItem">, checked: readonly string[]): boolean {
  try {
    storage.setItem(storageKey, serializeBackup(checked));
    return true;
  } catch {
    return false;
  }
}
