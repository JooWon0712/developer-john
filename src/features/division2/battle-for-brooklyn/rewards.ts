import type { RewardGroup, RewardItem, RewardSource } from "../reward-checklist-types";

export type BrooklynGroupId =
  | "weapons" | "gear" | "weapon-skins" | "skills" | "hunter-masks"
  | "ubisoft-connect" | "deluxe" | "exploration-commendations" | "expired-promotions";

type BrooklynReward = RewardItem & {
  group: BrooklynGroupId;
  ashChest?: true;
};

export const groups: readonly (RewardGroup & { id: BrooklynGroupId })[] = [
  { id: "weapons", tier: "core", title: { ko: "무기", en: "Weapons" } },
  { id: "gear", tier: "core", title: { ko: "보호장구", en: "Gear" } },
  { id: "weapon-skins", tier: "core", title: { ko: "무기 스킨", en: "Weapon skins" } },
  { id: "skills", tier: "core", title: { ko: "스킬", en: "Skills" } },
  {
    id: "hunter-masks", tier: "core", title: { ko: "헌터 마스크", en: "Hunter masks" },
    note: {
      ko: "기존 헌터 8명은 각 마스크와 Ash 열쇠를 줍니다. 피닉스는 별도의 상시 보상입니다.",
      en: "The eight original Hunters drop their masks and Ash Keys. Phoenix is a separate, permanent reward.",
    },
  },
  {
    id: "ubisoft-connect", tier: "bonus", title: { ko: "Ubisoft Connect 보상", en: "Ubisoft Connect rewards" },
    note: {
      ko: "보상 메뉴에서 직접 수령하는 항목입니다. 각 보상에 연결된 임무와 현재 수령 가능 여부는 확인되지 않았어요. 계정의 보상 목록을 확인하세요.",
      en: "These were claimed manually through Rewards. The mission for each item and current claim availability are unconfirmed. Check your account’s rewards list.",
    },
  },
  {
    id: "deluxe", tier: "bonus", title: { ko: "디럭스 구성", en: "Deluxe edition contents" },
    note: {
      ko: "디럭스에 포함된 외형 2종입니다. 레벨 40 부스트와 보관함 확장은 DLC 구성으로 안내되며 체크 항목에서 제외됩니다.",
      en: "These two cosmetics come with the Deluxe edition. The DLC’s level 40 boost and stash expansion are listed as features and are excluded from the checklist.",
    },
  },
  { id: "exploration-commendations", tier: "bonus", title: { ko: "탐험·공훈", en: "Exploration and commendations" } },
  {
    id: "expired-promotions", tier: "expired", title: { ko: "종료된 프로모션", en: "Ended promotions" },
    note: {
      ko: "종료된 캠페인 기록입니다. 현재 체크리스트 진행률에는 포함되지 않아요.",
      en: "These campaigns have ended and do not count toward checklist progress.",
    },
  },
];

export const launchSource: RewardSource = {
  href: "https://www.ubisoft.com/en-us/game/the-division/the-division-2/news-updates/4lCW3JXzLU7sMRuqHUjNQH",
  label: { ko: "Ubisoft DLC 출시 안내", en: "Ubisoft DLC launch notes" },
};

const anniversarySource: RewardSource = {
  href: "https://www.ubisoft.com/en-us/game/the-division/news-updates/40NvrweUD4Fon7HVS1zetr/battle-for-brooklyn-1-year-celebration",
  label: { ko: "Ubisoft 브루클린 1주년 안내", en: "Ubisoft Brooklyn anniversary notes" },
};

export const ashChest = {
  id: "ash-chest",
  tier: "core",
  title: { ko: "브리지 정착지 Ash 상자 보상", en: "Ash chest rewards at The Bridge" },
  note: {
    ko: "기존 브루클린 헌터 8명이 떨어뜨리는 잿빛 열쇠(Ash Key) 8개로 브리지 정착지의 Ash 상자를 여세요. 헌츠맨과 Hunter of Hunters 무기 스킨을 함께 받습니다.",
    en: "Collect the eight Ash Keys from the original Brooklyn Hunters and open the Ash chest at The Bridge settlement. You’ll receive both the Huntsman and the Hunter of Hunters weapon skin.",
  },
  video: { href: "https://www.youtube.com/watch?v=rCGLpsK9_Rk", label: { ko: "Ash 상자 획득 영상", en: "Ash chest walkthrough" } },
} as const;

const smartCoverRequirement = {
  ko: "브루클린 캠페인에서 H5 Refinery 임무를 마친 뒤 브리지 정착지 방어를 완료하면 해금됩니다.",
  en: "Progress the Brooklyn campaign through H5 Refinery and finish defending The Bridge settlement to unlock it.",
};

const smartCoverLinks = [launchSource, {
  href: "https://www.destructoid.com/how-to-unlock-the-smart-cover-skill-in-the-division-2/",
  label: { ko: "스마트 엄폐 해금 순서", en: "Smart Cover unlock walkthrough" },
}];

const ashCapture = {
  href: "https://blast.tv/gaming/news/the-division-2-how-to-get-the-huntsman-auto-rifle",
  credit: "Ubisoft / BLAST",
};

const hunterMaskCapture = {
  href: "https://gamerch.com/td2/844436",
  credit: "Gamerch",
};

const originalHunters = [
  ["lumen", "루멘", "Lumen", "2:16", 136, 368],
  ["merry", "메리", "Merry", "4:59", 299, 360],
  ["cipher", "암호", "Cipher", "6:50", 410, 363],
  ["craver", "갈구자", "Craver", "8:11", 491, 334],
  ["conqueror", "정복자", "Conqueror", "9:33", 573, 327],
  ["redtail", "레드테일", "Redtail", "12:09", 729, 359],
  ["tracker", "추적자", "Tracker", "16:08", 968, 180],
  ["necronos", "네크로노스", "Necronos", "17:54", 1074, 366],
] as const;

const hunterMasks: BrooklynReward[] = originalHunters.map(([id, ko, en, timestamp, seconds, size]) => ({
  id: `hunter-${id}`,
  group: "hunter-masks",
  name: { ko, en },
  localizedNameUnconfirmed: true,
  requirement: {
    ko: "브루클린의 전용 퍼즐을 풀어 헌터를 소환하고 처치하면 마스크와 Ash 열쇠를 얻습니다.",
    en: "Solve the Brooklyn Hunter’s puzzle, then defeat the Hunter for the mask and an Ash Key.",
  },
  note: id === "necronos" ? {
    ko: "다른 헌터 7명을 먼저 처치하세요. 시작 은신처의 화이트보드와 상호작용한 뒤 자외선 표식을 따라 옥상으로 올라가세요.",
    en: "Defeat the other seven Hunters first. Interact with the whiteboard at the starting safehouse and follow the UV markings to the rooftop.",
  } : undefined,
  links: [{
    href: `https://www.youtube.com/watch?v=dPvGGc4YRn0&t=${seconds}s`,
    label: { ko: `RogueGold · ${ko} (${timestamp})`, en: `RogueGold · ${en} (${timestamp})` },
  }],
  image: { file: `hunter-${id}.webp`, width: size, height: size, source: hunterMaskCapture },
}));

const connectRequirement = {
  ko: "브루클린 임무 조건을 충족한 뒤 Ubisoft Connect 보상 목록에서 직접 수령하세요.",
  en: "After meeting the Brooklyn mission requirements, claim the item in Ubisoft Connect Rewards.",
};

const connectLinks = [{
  href: "https://www.reddit.com/r/thedivision/comments/1ky20zc/",
  label: { ko: "플레이어 수령 사례", en: "Player claim reports" },
}];

const playerCapture = {
  credit: { ko: "사용자 제공 인게임 캡처", en: "User-provided in-game capture" },
};

const deluxeRequirement = {
  ko: "브루클린 전투 디럭스 DLC 에디션에 포함됩니다.",
  en: "Included with the Battle for Brooklyn Deluxe DLC edition.",
};

const deluxeLinks = [{
  href: "https://store.steampowered.com/app/3572160/",
  label: { ko: "Ubisoft 에디션 구성 (Steam)", en: "Ubisoft edition contents (Steam)" },
}, {
  href: "https://www.xbox.com/ko-KR/games/store/dlc-2/9N6D7X1RC78T/0010",
  label: { ko: "Xbox 한국어 상품 안내", en: "Korean Xbox store listing" },
}];

const canvasOutfitVideo = {
  href: "https://www.youtube.com/watch?v=zHwR3fRTV8k&t=90s",
  label: { ko: "DJTICKLE · 의상 착용 화면 (1:30)", en: "DJTICKLE · Outfit preview (1:30)" },
};

const canvasWeaponSkinVideo = {
  href: "https://www.youtube.com/watch?v=zHwR3fRTV8k&t=68s",
  label: { ko: "DJTICKLE · 무기 스킨 장착 화면 (1:08)", en: "DJTICKLE · Equipped weapon skin (1:08)" },
};

const archivistLinks = [{
  href: "https://www.windowscentral.com/gaming/the-division-2s-new-brooklyn-archivist-merit-commendation-was-driving-me-insane-it-turns-out-theres-a-sneaky-extra-step-you-need-to-do-first",
  label: { ko: "카드와 마지막 ECHO 위치", en: "Card and final ECHO locations" },
}];

export const rewards: readonly BrooklynReward[] = [
  {
    id: "huntsman", group: "weapons", name: { ko: "헌츠맨", en: "Huntsman" },
    requirement: { ko: "네임드 돌격소총", en: "Named assault rifle" },
    ashChest: true,
  },
  {
    id: "catalyst", group: "gear", name: { ko: "카탈리스트", en: "The Catalyst" },
    requirement: {
      ko: "아미 터미널(Army Terminal)의 최종 보스나 브루클린 오픈 월드 네임드 적 찰리(Charlie)에게서 확률로 획득하는 특급 마스크입니다.",
      en: "Exotic mask with a chance to drop from the Army Terminal final boss or Charlie, a named enemy in Brooklyn’s open world.",
    },
    links: [launchSource, { href: "https://shd.gg/gear/the-catalyst", label: { ko: "장비 데이터의 획득처", en: "Drop sources in the gear database" } },
      { href: "https://www.youtube.com/watch?v=zgnC0obDtFc", label: { ko: "아미 터미널 획득 영상", en: "Army Terminal gameplay (Korean)" } }],
  },
  {
    id: "hunter-of-hunters", group: "weapon-skins", name: { ko: "Hunter of Hunters", en: "Hunter of Hunters" },
    localizedNameUnconfirmed: true,
    requirement: { ko: "범용 무기 스킨", en: "Universal weapon skin" },
    ashChest: true,
    image: { file: "hunter-of-hunters.webp", width: 214, height: 192, source: ashCapture },
  },
  {
    id: "smart-cover-precision", group: "skills", name: { ko: "스마트 엄폐물 (정밀화)", en: "Precision Smart Cover" },
    requirement: smartCoverRequirement,
    note: { ko: "공격형 스마트 엄폐입니다. 무기 조작을 강화하고 엄폐 밖의 적에게 주는 피해를 높입니다.", en: "Offensive Smart Cover variant that improves weapon handling and damage to targets out of cover." },
    links: smartCoverLinks,
  },
  {
    id: "smart-cover-fortified", group: "skills", name: { ko: "스마트 엄폐물 (요새화)", en: "Fortified Smart Cover" },
    requirement: smartCoverRequirement,
    note: { ko: "방어형 스마트 엄폐입니다. 추가 방어도와 저항력을 부여합니다.", en: "Defensive Smart Cover variant that grants bonus armor and resistances." },
    links: smartCoverLinks,
  },
  ...hunterMasks,
  {
    id: "hunter-phoenix", group: "hunter-masks", name: { ko: "피닉스", en: "Phoenix" },
    localizedNameUnconfirmed: true,
    requirement: {
      ko: "상시 보상 · 브루클린 DLC에서 기존 헌터 퍼즐 8개를 완료한 뒤 피닉스 전용 퍼즐을 풀고 헌터를 처치하세요.",
      en: "Permanent reward · Complete the eight original Brooklyn Hunter puzzles, then solve the separate Phoenix puzzle and defeat the Hunter.",
    },
    note: {
      ko: "2026년 5월 26일 추가됐어요. 피닉스는 Ash 상자에 필요한 열쇠 8개에 포함되지 않습니다.",
      en: "Introduced May 26, 2026. Phoenix is separate from the eight Ash Keys needed for the chest.",
    },
    links: [
      { href: "https://youtu.be/nnqDtvg3NjE", label: { ko: "피닉스 별도 공략 영상", en: "Phoenix puzzle walkthrough" } },
      { href: "https://steamcommunity.com/sharedfiles/filedetails/?id=3732761410", label: { ko: "피닉스 퍼즐 단계별 안내", en: "Step-by-step Phoenix puzzle guide" } },
      anniversarySource,
    ],
    image: { file: "hunter-phoenix.webp", width: 126, height: 126, source: hunterMaskCapture },
  },
  {
    id: "connect-brooklyn-bats-cap", group: "ubisoft-connect", name: { ko: "브루클린 배츠 캡모자", en: "Brooklyn Bats Cap" },
    availabilityUnconfirmed: true, requirement: connectRequirement, links: connectLinks,
    image: { file: "connect-brooklyn-bats-cap.webp", width: 198, height: 111, source: playerCapture },
  },
  {
    id: "connect-brooklyn-bats-jersey", group: "ubisoft-connect", name: { ko: "브루클린 배츠 저지", en: "Brooklyn Bats Jersey" },
    availabilityUnconfirmed: true, requirement: connectRequirement, links: connectLinks,
    image: { file: "connect-brooklyn-bats-jersey.webp", width: 112, height: 126, source: playerCapture },
  },
  {
    id: "connect-brooklyn-bats-weapon-skin", group: "ubisoft-connect", name: { ko: "브루클린 배츠 무기 스킨", en: "Brooklyn Bats (weapon skin)" },
    availabilityUnconfirmed: true, requirement: connectRequirement, links: connectLinks,
    image: { file: "connect-brooklyn-bats-weapon-skin.webp", width: 115, height: 115, source: playerCapture },
  },
  {
    id: "deluxe-canvas-outfit", group: "deluxe", name: { ko: "캔버스 의상", en: "Canvas Outfit" },
    requirement: deluxeRequirement, links: [canvasOutfitVideo, ...deluxeLinks],
    note: { ko: "이미지에 표시된 구성품은 캔버스 후드입니다.", en: "The image shows the Canvas Hoodie from the outfit." },
    image: {
      file: "deluxe-canvas-outfit.webp", width: 119, height: 139, source: playerCapture,
      caption: { ko: "캔버스 의상 구성품 · 캔버스 후드", en: "Canvas Outfit component · Canvas Hoodie" },
    },
  },
  {
    id: "deluxe-canvas-weapon-skin", group: "deluxe", name: { ko: "캔버스 무기 스킨", en: "Canvas Weapon Skin" },
    requirement: deluxeRequirement, links: [canvasWeaponSkinVideo, ...deluxeLinks],
    image: { file: "deluxe-canvas-weapon-skin.webp", width: 120, height: 119, source: playerCapture },
  },
  {
    id: "danvers-network", group: "exploration-commendations", name: { ko: "Danver’s Network", en: "Danver’s Network" },
    localizedNameUnconfirmed: true,
    requirement: { ko: "브루클린 오픈 월드의 네임드 적을 처치해 카드 16장을 모으면 마지막 ECHO가 열립니다.", en: "Collect all 16 cards from named enemies in Brooklyn’s open world to unlock the final ECHO." },
    links: archivistLinks,
  },
  {
    id: "brooklyn-archivist-merit", group: "exploration-commendations", name: { ko: "Brooklyn Archivist Merit", en: "Brooklyn Archivist Merit" },
    localizedNameUnconfirmed: true,
    requirement: { ko: "브루클린 지역 기록을 모으세요. 텍스트 기록 3개는 ECHO에서 얻으며, 마지막 ECHO는 Danver’s Network 카드 16장을 모으면 열립니다.", en: "Collect the Brooklyn district records. The three text logs come from ECHOs, including the final one unlocked by completing Danver’s Network." },
    links: archivistLinks,
  },
  {
    id: "promo-brooklyn-launch-drops", group: "expired-promotions", name: { ko: "출시 Twitch Drops", en: "Launch Twitch Drops" },
    requirement: { ko: "2025.05.27–06.10 · 네임드 상자, 특급 상자, 블랙 터스크 무기 스킨 4종과 Bravo 백팩 장식.", en: "May 27–June 10, 2025 · Named and Exotic Caches, four Black Tusk weapon skins and the Bravo backpack trophy." },
    links: [launchSource, { href: "https://x.com/TheDivisionGame/status/1927424570232885315", label: { ko: "The Division 공식 드롭스 공지", en: "The Division’s Drops announcement" } }],
  },
  {
    id: "promo-brooklyn-anniversary-pass", group: "expired-promotions", name: { ko: "브루클린 1주년 이벤트 패스", en: "Brooklyn Celebration Event Pass" },
    requirement: { ko: "2026.05.21–06.04 · 무료·프리미엄 트랙의 의상과 특급 상자.", en: "May 21–June 4, 2026 · Outfits and Exotic Caches across the free and premium tracks." },
    links: [anniversarySource],
  },
  {
    id: "promo-brooklyn-corrosive-shell", group: "expired-promotions", name: { ko: "Corrosive Shell 글로벌 이벤트", en: "Corrosive Shell Global Event" },
    localizedNameUnconfirmed: true,
    requirement: {
      ko: "2026.05.26–06.04 · 글로벌 이벤트 보상 트랙을 완료하면 Corroded Mask를 받을 수 있었어요.",
      en: "May 26–June 4, 2026 · Completing the Global Event reward track awarded the Corroded Mask.",
    },
    links: [anniversarySource],
  },
  {
    id: "promo-brooklyn-anniversary-drops", group: "expired-promotions", name: { ko: "브루클린 1주년 Twitch Drops", en: "Brooklyn anniversary Twitch Drops" },
    requirement: { ko: "2026.05.21–05.28 · Purple Flame Skull 및 The Bridge 팔 휘장, 상자, Purple Fire 무기 스킨.", en: "May 21–28, 2026 · Purple Flame Skull and The Bridge arm patches, caches, and the Purple Fire weapon skin." },
    links: [{
      href: "https://www.ubisoft.com/en-gb/game/the-division/the-division-2/news-updates/1ex7oW6flvR1xX86itbHMN/the-division-2-battle-for-brooklyn-celebration-twitch-drops",
      label: { ko: "Ubisoft 1주년 드롭스 안내", en: "Ubisoft anniversary Drops notes" },
    }],
  },
];
