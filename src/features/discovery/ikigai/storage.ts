import { makeInitialState, normalizeState, type IkigaiState } from "./model";

export const STORAGE_KEY = "developer-john:discovery:ikigai:v1";
export type StorageState = "ready" | "unavailable" | "corrupt";
export type StoredState = { data: IkigaiState; state: StorageState };
type StateStorage = Pick<Storage, "getItem" | "setItem">;

function decode(raw: string | null): StoredState {
  if (raw === null) return { data: makeInitialState(), state: "ready" };
  try { return { data: normalizeState(JSON.parse(raw)), state: "ready" }; }
  catch { return { data: makeInitialState(), state: "corrupt" }; }
}
export function readStoredState(storage: Pick<Storage, "getItem">): StoredState {
  try { return decode(storage.getItem(STORAGE_KEY)); }
  catch { return { data: makeInitialState(), state: "unavailable" }; }
}
/** Refuse to overwrite unreadable existing records; deleting those is an explicit user action. */
export function writeStoredState(storage: StateStorage, state: IkigaiState): boolean {
  try {
    const snapshot = normalizeState(state);
    if (readStoredState(storage).state !== "ready") return false;
    storage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    return true;
  } catch { return false; }
}
export function deleteStoredState(storage: Pick<Storage, "removeItem">): boolean {
  try { storage.removeItem(STORAGE_KEY); return true; }
  catch { return false; }
}
/** A deleted service key or localStorage.clear() in another tab resets the local snapshot. */
export function decodeStorageEvent(event: Pick<StorageEvent, "key" | "newValue">): StoredState | null {
  if (event.key !== STORAGE_KEY && event.key !== null) return null;
  return decode(event.key === null ? null : event.newValue);
}
