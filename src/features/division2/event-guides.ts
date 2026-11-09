import { releaseDate } from "./central-park/rewards";
import { event as redMoon } from "./red-moon/event";

export type Division2Language = "ko" | "en";

export const division2Paths: Record<Division2Language, string> = {
  ko: "/workspace/game/the-division-2",
  en: "/en/workspace/game/the-division-2",
};

type LocalizedText = Record<Division2Language, string>;

type Division2EventGuide = {
  id: string;
  directory: string;
  title: LocalizedText;
  description: LocalizedText;
  paths: Record<Division2Language, string>;
} & (
  | { kind: "event"; startsOn: string; endsOn: string }
  | { kind: "base" | "dlc"; releasedOn: string }
);

const centralParkDirectory = "echoes-of-central-park-2026";

export const centralParkGuide = {
  id: centralParkDirectory,
  directory: centralParkDirectory,
  kind: "dlc",
  title: { ko: "센트럴 파크의 메아리", en: "Echoes of Central Park" },
  description: {
    ko: "신규 무기와 스킬, 숨겨진 헌터 마스크, 출시 드롭스와 코드 보상까지 살펴보고 수령 내역을 기록하세요.",
    en: "Find new weapons, skills, hidden Hunter masks, launch Drops and code rewards, then track the rewards you have claimed.",
  },
  paths: {
    ko: `${division2Paths.ko}/${centralParkDirectory}`,
    en: `${division2Paths.en}/${centralParkDirectory}`,
  },
  releasedOn: releaseDate,
} satisfies Division2EventGuide;

const brooklynDirectory = "battle-for-brooklyn-2025";

export const brooklynGuide = {
  id: brooklynDirectory,
  directory: brooklynDirectory,
  kind: "dlc",
  title: { ko: "브루클린 전투", en: "Battle for Brooklyn" },
  description: {
    ko: "헌츠맨, 특급 마스크, 스마트 엄폐와 숨겨진 헌터 마스크 등 브루클린 DLC 보상의 획득 조건을 확인하고 받은 보상을 기록하세요.",
    en: "Check how to earn the Huntsman, Catalyst, Smart Cover and hidden Hunter masks, then track the Brooklyn DLC rewards you have collected.",
  },
  paths: {
    ko: `${division2Paths.ko}/${brooklynDirectory}`,
    en: `${division2Paths.en}/${brooklynDirectory}`,
  },
  releasedOn: "2025-05-27",
} satisfies Division2EventGuide;

const warlordsDirectory = "warlords-of-new-york-2020";

export const warlordsGuide = {
  id: warlordsDirectory,
  directory: warlordsDirectory,
  kind: "dlc",
  title: { ko: "뉴욕의 지배자", en: "Warlords of New York" },
  description: {
    ko: "캠페인 스킬과 확장팩 헌터 마스크, 헤이븐의 열쇠 상자 보상을 확인하고 획득 내역을 기록하세요.",
    en: "Track campaign skill unlocks, expansion Hunter masks and the rewards in Haven’s locked chest.",
  },
  paths: {
    ko: `${division2Paths.ko}/${warlordsDirectory}`,
    en: `${division2Paths.en}/${warlordsDirectory}`,
  },
  releasedOn: "2020-03-03",
} as const satisfies Division2EventGuide;

const baseGameDirectory = "base-game-2019";

export const baseGameGuide = {
  id: baseGameDirectory,
  directory: baseGameDirectory,
  kind: "base",
  title: { ko: "본편 · 워싱턴 D.C.", en: "Base game · Washington, D.C." },
  description: {
    ko: "워싱턴 D.C.의 기존 헌터 마스크와 백악관 상아 상자 보상, 제작으로 얻는 주요 특급 무기를 확인하고 획득 내역을 기록하세요.",
    en: "Track the original Washington, D.C. Hunter masks, White House Ivory Chest rewards and selected craftable Exotic weapons.",
  },
  paths: {
    ko: `${division2Paths.ko}/${baseGameDirectory}`,
    en: `${division2Paths.en}/${baseGameDirectory}`,
  },
  releasedOn: "2019-03-15",
} as const satisfies Division2EventGuide;

// Keep reward data and saved progress with each guide.
export const division2EventGuides: Division2EventGuide[] = [
  centralParkGuide,
  brooklynGuide,
  warlordsGuide,
  baseGameGuide,
  {
    id: redMoon.id,
    directory: redMoon.slug,
    kind: "event",
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
