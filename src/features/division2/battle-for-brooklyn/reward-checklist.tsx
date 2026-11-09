"use client";

import type { Division2Language } from "../event-guides";
import { RewardChecklist } from "../reward-checklist";
import { ashChest, groups, rewards } from "./rewards";

const groupSections = groups.map(group => ({
  ...group,
  items: rewards.filter(item => item.group === group.id && !item.ashChest),
}));
const categoryTitles = new Map(groups.map(group => [group.id, group.title]));
const sections = [
  ...groupSections.filter(section => section.id === "skills"),
  {
    ...ashChest,
    links: [ashChest.video],
    items: rewards.filter(item => item.ashChest).map(item => ({ ...item, kind: categoryTitles.get(item.group) })),
  },
  ...groupSections.filter(section => section.id !== "skills"),
];

export function BrooklynChecklist({ language }: { language: Division2Language }) {
  return (
    <RewardChecklist
      language={language}
      collection="battle-for-brooklyn-2025"
      prefix="brooklyn"
      name={language === "ko" ? "브루클린 전투" : "Battle for Brooklyn"}
      sections={sections}
      groups={groups}
    />
  );
}
