import { event, records } from "./event";

export const STORAGE_KEY = "developer-john:division2:red-moon-unleashed-2026:v1";
export const PROGRESS_SCHEMA = 1;
export type Progress = {
  eventId: string;
  schema: 1;
  checkedIds: string[];
  apparelCount: number;
  savedAt: string | null;
};

const validIds = new Set(records.map(record => record.id));
const apparelTotal = 43;

export function createEmptyProgress(): Progress {
  return { eventId: event.id, schema: PROGRESS_SCHEMA, checkedIds: [], apparelCount: 0, savedAt: null };
}

/** Validate this service's state. Historical wrapper formats are intentionally unsupported. */
export function normalizeProgress(raw: unknown): Progress {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    throw new Error("저장 기록 형식을 확인할 수 없어요.");
  }
  const value = raw as Record<string, unknown>;
  if (value.eventId !== event.id || value.schema !== PROGRESS_SCHEMA ||
      !Array.isArray(value.checkedIds) ||
      !value.checkedIds.every(id => typeof id === "string" && validIds.has(id)) ||
      typeof value.apparelCount !== "number" || !Number.isInteger(value.apparelCount) ||
      value.apparelCount < 0 || value.apparelCount > apparelTotal ||
      !(value.savedAt === null || (typeof value.savedAt === "string" && Number.isFinite(Date.parse(value.savedAt))))) {
    throw new Error("이 이벤트의 올바른 저장 기록이 아니에요.");
  }
  return {
    eventId: event.id,
    schema: PROGRESS_SCHEMA,
    checkedIds: [...new Set(value.checkedIds as string[])],
    apparelCount: value.apparelCount,
    savedAt: value.savedAt as string | null,
  };
}

export function summarizeProgress(progress: Progress) {
  const checked = new Set(progress.checkedIds);
  const count = (type: "reward" | "bounty" | "owned") => {
    const list = records.filter(record => record.type === type);
    return { current: list.filter(record => checked.has(record.id)).length, total: list.length };
  };
  return {
    reward: count("reward"),
    bounty: count("bounty"),
    owned: count("owned"),
    apparel: { current: progress.apparelCount, total: apparelTotal },
  };
}

export function toggleCheck(progress: Progress, id: string, checked?: boolean): Progress {
  if (!validIds.has(id)) throw new Error("알 수 없는 체크 항목이에요.");
  const ids = new Set(progress.checkedIds);
  const next = checked ?? !ids.has(id);
  if (next) ids.add(id);
  else ids.delete(id);
  return { ...progress, checkedIds: [...ids] };
}

export function setApparelCount(progress: Progress, count: number): Progress {
  if (!Number.isInteger(count) || count < 0 || count > apparelTotal) {
    throw new Error("의류 수량은 0~43의 정수로 입력하세요.");
  }
  return { ...progress, apparelCount: count };
}
