const schemaVersion = 1;

export const maxBackupBytes = 256 * 1024;

type StoredProgress = {
  checked: string[];
  mode: "ready" | "unavailable" | "corrupt";
};

export function createChecklistProgress(collection: string, ids: readonly string[], guide: string) {
  const storageKey = `developer-john:division2:${collection}:v${schemaVersion}`;
  const validIds = new Set(ids);

  function knownChecks(checked: readonly string[]): string[] {
    return [...new Set(checked.filter(id => validIds.has(id)))];
  }

  function parseBackup(raw: string): string[] {
    if (raw.length > maxBackupBytes || new TextEncoder().encode(raw).byteLength > maxBackupBytes) {
      throw new Error(`${guide} backup exceeds 256 KiB.`);
    }

    const record: unknown = JSON.parse(raw.replace(/^\uFEFF/, ""));
    if (typeof record !== "object" || record === null || Array.isArray(record)) {
      throw new Error(`Invalid ${guide} backup.`);
    }

    const value = record as Record<string, unknown>;
    if (value.collection !== collection || value.schemaVersion !== schemaVersion ||
        !Array.isArray(value.checked) || !value.checked.every(id => typeof id === "string")) {
      throw new Error(`Invalid ${guide} backup.`);
    }

    // Restore only explicit checks, ignoring any extra fields from older backups.
    return knownChecks(value.checked);
  }

  function serializeBackup(checked: readonly string[]): string {
    return JSON.stringify({ schemaVersion, collection, checked: knownChecks(checked) });
  }

  function loadProgress(storage: Pick<Storage, "getItem">): StoredProgress {
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

  function saveProgress(storage: Pick<Storage, "setItem">, checked: readonly string[]): boolean {
    try {
      storage.setItem(storageKey, serializeBackup(checked));
      return true;
    } catch {
      return false;
    }
  }

  return { storageKey, parseBackup, serializeBackup, loadProgress, saveProgress };
}
