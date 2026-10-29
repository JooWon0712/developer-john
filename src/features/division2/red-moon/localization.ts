import { categories, event, groups, images } from "./event";
import { categoriesEn, groupsEn, imagesEn } from "./event-en";

export type Language = "ko" | "en";
export const englishEventPath = `/en${event.path}`;
export function getEventPath(language: Language) {
  return language === "en" ? englishEventPath : event.path;
}
export function getLocalizedEventData(language: Language) {
  return language === "en"
    ? { categories: categoriesEn, groups: groupsEn, images: imagesEn }
    : { categories, groups, images };
}

const searchIndex = new Map<string, string[]>();
for (const content of [{ groups, images }, { groups: groupsEn, images: imagesEn }]) {
  for (const group of content.groups) {
    for (const entry of group.entries) {
      const text = [entry.title, entry.detail, entry.tag, entry.search, entry.notice?.title, ...(entry.notice?.paragraphs ?? []), entry.notice?.period.title,
        ...entry.checks.map(check => `${check.label} ${content.images[check.id]?.title ?? ""}`)].filter(Boolean).join(" ");
      const previous = searchIndex.get(entry.id) ?? [];
      searchIndex.set(entry.id, [...previous, text]);
    }
  }
}
/** Both languages remain searchable regardless of the displayed language. */
export function getRewardSearchText(entryId: string) {
  return (searchIndex.get(entryId) ?? []).join(" ");
}
