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
  | { kind: "dlc"; releasedOn: string }
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

// Keep reward data and saved progress with each guide.
export const division2EventGuides: Division2EventGuide[] = [
  centralParkGuide,
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
