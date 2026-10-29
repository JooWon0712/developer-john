import { createEmptyProgress, normalizeProgress, STORAGE_KEY, type Progress } from "./progress";

type ProgressStorage = Pick<Storage, "getItem" | "setItem">;
export type StorageState = "ready" | "unavailable" | "corrupt";

export function readStoredProgress(storage: ProgressStorage): { progress: Progress; state: StorageState } {
  let raw: string | null;
  try {
    raw = storage.getItem(STORAGE_KEY);
  } catch {
    return { progress: createEmptyProgress(), state: "unavailable" };
  }
  if (raw === null) return { progress: createEmptyProgress(), state: "ready" };
  try {
    return { progress: normalizeProgress(JSON.parse(raw)), state: "ready" };
  } catch {
    return { progress: createEmptyProgress(), state: "corrupt" };
  }
}

export function writeStoredProgress(storage: ProgressStorage, progress: Progress): boolean {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(progress));
    return true;
  } catch {
    return false;
  }
}
