import { event as redMoon } from "./red-moon/event";

export type Division2Language = "ko" | "en";

export const division2Paths: Record<Division2Language, string> = {
  ko: "/services/game/the-division-2",
  en: "/en/services/game/the-division-2",
};

type LocalizedText = Record<Division2Language, string>;

type Division2EventGuide = {
  id: string;
  directory: string;
  title: LocalizedText;
  description: LocalizedText;
  paths: Record<Division2Language, string>;
  startsOn: string;
  endsOn: string;
};

// Register each new event here; reward data and saved progress stay with its guide.
export const division2EventGuides: Division2EventGuide[] = [
  {
    id: redMoon.id,
    directory: redMoon.slug,
    title: { ko: "레드 문 언리시드", en: "Red Moon Unleashed" },
    description: {
      ko: "현상수배·보스·기부·접속·Twitch 드롭스 보상과 획득 조건을 확인하고, 받은 보상을 기록하세요.",
      en: "Review bounty, boss, donation, login and Twitch Drops rewards, then track the items you have claimed.",
    },
    paths: { ko: redMoon.path, en: `/en${redMoon.path}` },
    startsOn: redMoon.startsOn,
    endsOn: redMoon.endsOn,
  },
];
