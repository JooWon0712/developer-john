import { createChecklistProgress, maxBackupBytes } from "../checklist-progress";
import { guardianCards } from "./collectibles";
import { gamescomPromotion, rewards } from "./rewards";

export { maxBackupBytes };

export const { storageKey, parseBackup, serializeBackup, loadProgress, saveProgress } = createChecklistProgress(
  "echoes-of-central-park-2026",
  [...rewards, ...guardianCards, ...gamescomPromotion.items].map(item => item.id),
  "Central Park",
);
