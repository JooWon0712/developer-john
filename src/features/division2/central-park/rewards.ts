export type Localized = { ko: string; en: string };

type RewardSource = { label: Localized; href: string };
type ProgressionStage = "campaign" | "guardians" | "containment";

export type RewardGroup = {
  id: string;
  tier: "core" | "bonus";
  title: Localized;
  description?: Localized;
};

export type RewardImage = {
  file: string;
  width: number;
  height: number;
};

export type Reward = {
  id: string;
  group: string;
  name: Localized;
  kind: Localized;
  progressionStage?: ProgressionStage;
  hunterChest?: true;
  condition?: Localized;
  note?: Localized;
  sources: readonly RewardSource[];
  image?: RewardImage;
};

const localized = (ko: string, en: string): Localized => ({ ko, en });

export const releaseDate = "2026-11-03";
export const dropsStartDate = "2026-11-03";
export const dropsEndDate = "2026-11-10";
export const codesVerifiedDate = "2026-11-07";
export const twitchInventoryUrl = "https://www.twitch.tv/drops/inventory";
export const redeemUrl = "https://redeem.ubisoft.com/thedivision2/";

export const clockworkVideoSources: readonly RewardSource[] = [
  { label: localized("GCROCK · 수호자 카드 6장 위치", "GCROCK · All six Guardian card locations"), href: "https://www.youtube.com/watch?v=Sq7ISdINYTk" },
  { label: localized("NothingButSkillz · 클락워크 해금 공략", "NothingButSkillz · How to unlock Clockwork"), href: "https://www.youtube.com/watch?v=eePiyupaS4U" },
];

export const launchSource: RewardSource = {
  label: localized("Ubisoft 공식 출시 안내", "Ubisoft launch announcement"),
  href: "https://www.ubisoft.com/en-us/game/the-division/the-division-2/news-updates/4yCTNp7RZ1Fdm1kMKYgndg/the-division-2-echoes-of-central-park-dlc-is-available-now",
};

export const dropsSource: RewardSource = {
  label: localized("Ubisoft 공식 드롭스 안내 · 보상 이미지", "Official Ubisoft Drops guide and reward images"),
  href: "https://www.ubisoft.com/en-us/game/the-division/the-division-2/news-updates/5EEgwKS6kDqyvUFo5PJYsB/the-division-2-echoes-of-central-park-launch-twitch-drops",
};

const hunterGuide = "https://youtu.be/uUBoo93QeKM";
const sources = {
  ratel: {
    label: localized("라텔 획득 공략", "The Ratel acquisition guide"),
    href: "https://www.keengamer.com/articles/guides/how-to-get-the-ratel-exotic-in-the-division-2-talent-mods-and-farming/",
  },
  apexChest: {
    label: localized("가슴 보호대 획득처 DB", "Chest plate loot database"),
    href: "https://shd.gg/gear/apex-protocol-chest",
  },
  guardians: {
    label: localized("수호자 보상 공략", "Guardian rewards guide"),
    href: "https://www.destructoid.com/all-guardian-boss-lairs-and-rewards-in-the-division-2-echoes-of-central-park/",
  },
  hunters: {
    label: localized("헌터 커뮤니티 공략", "Community Hunter guide"),
    href: "https://www.looter-shooters.com/masques-chasseurs-echos-central-park/",
  },
  piercing: {
    label: localized("RogueGold · 꿰뚫는 시선 획득 공략 (1:36)", "RogueGold · Piercing Gaze mask guide (1:36)"),
    href: `${hunterGuide}?t=96`,
  },
  craquelure: {
    label: localized("RogueGold · 균열 획득 공략 (3:29)", "RogueGold · Craquelure mask guide (3:29)"),
    href: `${hunterGuide}?t=209`,
  },
  shapeless: {
    label: localized("RogueGold · 셰이프리스 획득 공략 (6:22)", "RogueGold · Shapeless mask guide (6:22)"),
    href: `${hunterGuide}?t=382`,
  },
  murder: {
    label: localized("RogueGold · 머더 획득 공략 (9:53)", "RogueGold · Murder mask guide (9:53)"),
    href: `${hunterGuide}?t=593`,
  },
  editions: {
    label: localized("Ubisoft 에디션 안내", "Ubisoft DLC editions guide"),
    href: "https://www.ubisoft.com/ko-kr/game/the-division/the-division-2/news-updates/2o0p19fLQGze5j7h3iEXTN/the-division-2-echoes-of-central-park-showcase-everything-you-need-to-know",
  },
  ghostTour: {
    label: localized("Ubisoft Connect 수령 공략", "Ubisoft Connect claim guide"),
    href: "https://itemlevel.net/the-division-2-how-to-claim-free-central-park-apparel/",
  },
  paperRoute: {
    label: localized("페이퍼 루트 코드 안내", "The Paper Route code source"),
    href: "https://www.reddit.com/r/thedivision/comments/1x6rrwr/community_puzzle_free_kerman_coffee_apparel_cap/",
  },
  arg: {
    label: localized("ARG 코드 발견 원문", "Original ARG code discovery"),
    href: "https://www.reddit.com/r/thedivision/comments/1w3vt25/spoiler_the_division_2_echoes_of_central_park_arg/",
  },
} satisfies Record<string, RewardSource>;

export const hunterChest = {
  title: localized("탑 정착지 상자 · 보호장구·무기 스킨", "The Tower chest · Gear and weapon skin"),
  description: localized(
    "숨겨진 헌터 4명을 처치한 뒤 얻은 열쇠 4개로 탑 정착지의 잠긴 상자를 열면 두 보상을 함께 획득할 수 있어요.",
    "Defeat the four hidden Hunters and use their four keys to open the locked chest at The Tower settlement and collect both rewards.",
  ),
};

export const hunterMasksTitle = localized("숨겨진 헌터 마스크", "Hidden Hunter masks");

export const progressionStages: Record<ProgressionStage, { title: Localized; description?: Localized }> = {
  campaign: {
    title: localized("메인 미션 보상", "Main mission reward"),
  },
  guardians: {
    title: localized("메인 미션 이후 · 신규 스킬 5종", "After the main mission · Five new skills"),
    description: localized(
      "센트럴 파크 메인 미션을 완료한 뒤 수호자 5명을 각각 처음 처치하면 각자의 스킬이 해금돼요.",
      "After completing the Central Park main mission, defeat each of the five Guardians for the first time to unlock their skill variants.",
    ),
  },
  containment: {
    title: localized("센트럴 파크 봉쇄(보스런)", "Central Park Containment (boss run)"),
    description: localized(
      "수호자 5명을 모두 처음 처치하면 봉쇄가 열려요. 봉쇄에서 수호자 5명을 한 세션에서 다시 처치하세요.",
      "Containment unlocks once you’ve defeated all five Guardians. Defeat all five again in one Containment session.",
    ),
  },
};

export const groups: readonly RewardGroup[] = [
  {
    id: "skills",
    tier: "core",
    title: localized("신규 스킬·라텔 획득 순서", "How to unlock the new skills and The Ratel"),
  },
  {
    id: "weapons",
    tier: "core",
    title: localized("클락워크 획득", "Unlocking Clockwork"),
  },
  {
    id: "hunters",
    tier: "core",
    title: localized("숨겨진 헌터 보상", "Hidden Hunter rewards"),
  },
  {
    id: "apex",
    tier: "core",
    title: localized("에이펙스 프로토콜", "Apex Protocol"),
  },
  {
    id: "preorder",
    tier: "bonus",
    title: localized("예약구매 특전", "Pre-order bonus"),
  },
  {
    id: "connect",
    tier: "bonus",
    title: localized("Ubisoft Connect 보상", "Ubisoft Connect rewards"),
    description: localized(
      "각 임무 완료 후 Ubisoft Connect의 보상 목록에서 해금된 보상을 각각 직접 수령하세요.",
      "After completing each mission, claim its unlocked reward individually from the Ubisoft Connect rewards list.",
    ),
  },
  {
    id: "drops",
    tier: "bonus",
    title: localized("출시 Twitch Drops", "Launch Twitch Drops"),
    description: localized(
      "시청 시간이 충족되면 Twitch 드롭스 보관함에서 각 보상을 직접 수령하세요.",
      "Claim each reward in your Twitch Drops Inventory once you meet its watch-time requirement.",
    ),
  },
  {
    id: "arg",
    tier: "bonus",
    title: localized("사전 ARG 보상", "Pre-launch ARG rewards"),
  },
];

export const coupons: readonly { code: string; title: Localized; rewardIds: readonly string[] }[] = [
  { code: "PPR-X29-3JU-RTE", title: localized("센트럴 파크 ARG", "Central Park ARG"), rewardIds: ["arg-backpack", "arg-cup"] },
  { code: "F8H-CEN-7W5-PRK", title: localized("페이퍼 루트", "The Paper Route"), rewardIds: ["paper-route-cap", "paper-route-jacket"] },
];

export const gamescomPromotion = {
  code: "TD2-GMZ-C26-BKP",
  items: [
    {
      id: "gamescom-2026-shirt",
      name: localized("게임스컴 2026 셔츠", "Gamescom 2026 Shirt"),
      kind: localized("상의", "Top"),
      image: { file: "gamescom-2026-shirt.png", width: 144, height: 155 },
      sources: [],
    },
    {
      id: "gamescom-2026-arm-patch",
      name: localized("게임스컴 2026", "Gamescom 2026"),
      kind: localized("휘장", "Arm patch"),
      image: { file: "gamescom-2026-arm-patch.png", width: 155, height: 161 },
      sources: [],
    },
  ],
};

const guardianFarming = localized("센트럴 파크 수호자 파밍", "Farm Central Park Guardians.");
const hunterMask = localized("헌터 마스크", "Hunter mask");
const hunterPuzzle = localized("전용 퍼즐로 헌터를 소환한 뒤 처치", "Solve the Hunter’s puzzle to summon and defeat them.");
const argCode = localized("사전 ARG 공개 코드 등록 보상", "Redeem the pre-launch ARG code.");
const promoCode = localized("사전 홍보 공개 코드 등록 보상", "Redeem the pre-launch promotional code.");

export const rewards: readonly Reward[] = [
  {
    id: "ratel",
    group: "skills",
    progressionStage: "containment",
    name: localized("라텔", "The Ratel"),
    kind: localized("특급 돌격소총", "Exotic assault rifle"),
    condition: localized("센트럴 파크 봉쇄 최초 완료 시 100% 확정 드랍", "Guaranteed drop (100%) on your first Central Park Containment clear."),
    sources: [sources.ratel],
  },
  {
    id: "clockwork",
    group: "weapons",
    name: localized("클락워크", "Clockwork"),
    kind: localized("네임드 기관단총", "Named submachine gun"),
    condition: localized(
      "수호자 카드 6장을 모은 뒤 센트럴 파크 서쪽 입구의 금속문 안에서 ECHO를 작동하세요.",
      "Collect all six Guardian cards, then activate the ECHO inside the metal gate at Central Park’s west entrance.",
    ),
    sources: clockworkVideoSources,
  },
  {
    id: "specters-gloves",
    group: "hunters",
    hunterChest: true,
    name: localized("스펙터의 장갑", "Specter’s Gloves"),
    kind: localized("네임드 장갑", "Named gloves"),
    sources: [sources.hunters],
  },
  {
    id: "killer-weapon-skin",
    group: "hunters",
    hunterChest: true,
    name: localized("킬러", "Killer"),
    kind: localized("무기 스킨", "Weapon skin"),
    sources: [sources.hunters],
    image: { file: "killer-weapon-skin.png", width: 124, height: 128 },
  },
  {
    id: "apex-mask",
    group: "apex",
    name: localized("제니스 마스크", "Zenith Mask"),
    kind: localized("에이펙스 프로토콜 · 마스크", "Apex Protocol · Mask"),
    condition: guardianFarming,
    sources: [sources.guardians],
  },
  {
    id: "apex-chest",
    group: "apex",
    name: localized("아포지 가슴 보호대", "Apogee Chest Plate"),
    kind: localized("에이펙스 프로토콜 · 방탄복", "Apex Protocol · Chest armor"),
    condition: localized("센트럴 파크 미션 보상", "Central Park mission reward"),
    note: localized(
      "센트럴 파크 임무 완료 후 탑으로 귀환할 때 획득한 사례를 기준으로 안내해요. 매회 지급 여부는 확인되지 않았어요.",
      "This reward has been observed on returning to The Tower after completing a Central Park mission. Its drop rate is unconfirmed.",
    ),
    sources: [sources.apexChest],
  },
  {
    id: "apex-holster",
    group: "apex",
    name: localized("애크미 권총집", "Acme Holster"),
    kind: localized("에이펙스 프로토콜 · 권총집", "Apex Protocol · Holster"),
    condition: guardianFarming,
    sources: [sources.guardians],
  },
  {
    id: "apex-backpack",
    group: "apex",
    name: localized("늑대 팩", "Wolf Pack"),
    kind: localized("에이펙스 프로토콜 · 백팩", "Apex Protocol · Backpack"),
    condition: guardianFarming,
    sources: [sources.guardians],
  },
  {
    id: "apex-gloves",
    group: "apex",
    name: localized("피너클 장갑", "Pinnacle Gloves"),
    kind: localized("에이펙스 프로토콜 · 장갑", "Apex Protocol · Gloves"),
    condition: guardianFarming,
    sources: [sources.guardians],
  },
  {
    id: "apex-kneepads",
    group: "apex",
    name: localized("최정상 무릎 보호대", "Summit Kneepads"),
    kind: localized("에이펙스 프로토콜 · 무릎 보호대", "Apex Protocol · Kneepads"),
    condition: guardianFarming,
    sources: [sources.guardians],
  },
  {
    id: "skill-leech",
    group: "skills",
    progressionStage: "guardians",
    name: localized("리치 하이브", "Leech Hive"),
    kind: localized("하이브 변형", "Hive variant"),
    condition: localized("할로우 첫 처치", "Defeat Hollow for the first time."),
    sources: [sources.guardians],
  },
  {
    id: "skill-blackout",
    group: "skills",
    progressionStage: "guardians",
    name: localized("블랙아웃 시커", "Blackout Seeker"),
    kind: localized("대인 유도 지뢰 변형", "Seeker Mine variant"),
    condition: localized("스펙터 첫 처치", "Defeat Specter for the first time."),
    sources: [sources.guardians],
  },
  {
    id: "skill-corrosive",
    group: "skills",
    progressionStage: "guardians",
    name: localized("부식성 덫", "Corrosive Trap"),
    kind: localized("덫 변형", "Trap variant"),
    condition: localized("마이어 첫 처치", "Defeat Mire for the first time."),
    sources: [sources.guardians],
  },
  {
    id: "skill-howl",
    group: "skills",
    progressionStage: "campaign",
    name: localized("하울링", "The Howl"),
    kind: localized("펄스 변형", "Pulse variant"),
    condition: localized("센트럴 파크 메인 미션 완료 시 해금", "Unlocked by completing the Central Park main mission."),
    sources: [sources.guardians],
  },
  {
    id: "skill-gas",
    group: "skills",
    progressionStage: "guardians",
    name: localized("가스 폭격기", "Gas Bomber"),
    kind: localized("드론 변형", "Drone variant"),
    condition: localized("벌처 첫 처치", "Defeat Vulture for the first time."),
    sources: [sources.guardians],
  },
  {
    id: "skill-trophy",
    group: "skills",
    progressionStage: "guardians",
    name: localized("트로피 시스템", "Trophy System"),
    kind: localized("드론 변형", "Drone variant"),
    condition: localized("쏜 첫 처치", "Defeat Thorn for the first time."),
    sources: [sources.guardians],
  },
  {
    id: "hunter-shapeless",
    group: "hunters",
    name: localized("셰이프리스", "Shapeless"),
    kind: hunterMask,
    condition: hunterPuzzle,
    sources: [sources.shapeless],
    image: { file: "hunter-shapeless.png", width: 134, height: 151 },
  },
  {
    id: "hunter-murder",
    group: "hunters",
    name: localized("머더", "Murder"),
    kind: hunterMask,
    condition: hunterPuzzle,
    sources: [sources.murder],
    image: { file: "hunter-murder.png", width: 116, height: 136 },
  },
  {
    id: "hunter-piercing",
    group: "hunters",
    name: localized("꿰뚫는 시선", "Piercing Gaze"),
    kind: hunterMask,
    condition: hunterPuzzle,
    sources: [sources.piercing],
    image: { file: "hunter-piercing.png", width: 106, height: 130 },
  },
  {
    id: "hunter-craquelure",
    group: "hunters",
    name: localized("균열", "Craquelure"),
    kind: hunterMask,
    condition: localized("촛불 퍼즐로 헌터를 소환한 뒤 처치", "Solve the candle puzzle to summon and defeat the Hunter."),
    note: localized(
      "영상의 촛불 순서대로 손 흔들기 → 경례 → 팔 벌려 뛰기 → 도움 요청 → 손뼉치기 → 항복을 사용하세요.",
      "Follow the candle order in the video and use Wave → Salute → Jumping Jacks → Call for Help → Clap → Surrender.",
    ),
    sources: [sources.craquelure],
    image: { file: "hunter-craquelure.png", width: 130, height: 153 },
  },
  {
    id: "drop-patch",
    group: "drops",
    name: localized("센트럴 파크 팔 휘장", "Central Park Arm Patch"),
    kind: localized("팔 휘장", "Arm patch"),
    condition: localized("드롭스 활성 방송 누적 30분 시청", "Watch eligible streams for 30 minutes total."),
    sources: [],
  },
  {
    id: "drop-named",
    group: "drops",
    name: localized("네임드 상자", "Named Cache"),
    kind: localized("소모성 보상", "Consumable reward"),
    condition: localized("드롭스 활성 방송 누적 1시간 시청", "Watch eligible streams for 1 hour total."),
    sources: [],
  },
  {
    id: "drop-bird",
    group: "drops",
    name: localized("새 해골 백팩 장식", "Bird Skull Backpack Trophy"),
    kind: localized("백팩 장식", "Backpack trophy"),
    condition: localized("드롭스 활성 방송 누적 2시간 시청", "Watch eligible streams for 2 hours total."),
    sources: [],
  },
  {
    id: "drop-exotic",
    group: "drops",
    name: localized("특급 상자", "Exotic Cache"),
    kind: localized("소모성 보상", "Consumable reward"),
    condition: localized("드롭스 활성 방송 누적 3시간 시청", "Watch eligible streams for 3 hours total."),
    sources: [],
  },
  {
    id: "drop-token",
    group: "drops",
    name: localized("의상 토큰", "Outfit Token"),
    kind: localized("소모성 보상", "Consumable reward"),
    condition: localized("드롭스 활성 방송 누적 4시간 시청", "Watch eligible streams for 4 hours total."),
    sources: [],
  },
  {
    id: "preorder-mask",
    group: "preorder",
    name: localized("NY 정화자", "NY Purifier Mask"),
    kind: localized("예약 특전 마스크", "Pre-order mask"),
    condition: localized("센트럴 파크 DLC 예약구매 특전", "Pre-order bonus for the Echoes of Central Park DLC."),
    sources: [sources.editions],
    image: { file: "preorder-mask.png", width: 123, height: 144 },
  },
  {
    id: "ghost-tour-cap",
    group: "connect",
    name: localized("고스트 투어 캡모자", "Ghost Tour Cap"),
    kind: localized("모자", "Cap"),
    condition: localized("Lincoln Center 임무 완료", "Complete the Lincoln Center mission."),
    sources: [sources.ghostTour],
    image: { file: "ghost-tour-cap.png", width: 155, height: 123 },
  },
  {
    id: "ghost-tour-shirt",
    group: "connect",
    name: localized("고스트 투어 셔츠", "Ghost Tour Shirt"),
    kind: localized("셔츠", "Shirt"),
    condition: localized("One Columbus Circle 임무 완료", "Complete the One Columbus Circle mission."),
    sources: [sources.ghostTour],
    image: { file: "ghost-tour-shirt.png", width: 131, height: 149 },
  },
  {
    id: "ghost-tour-weapon-skin",
    group: "connect",
    name: localized("고스트 투어 무기 스킨", "Ghost Tour Weapon Skin"),
    kind: localized("무기 스킨", "Weapon skin"),
    condition: localized(
      "Natural History Museum of New York 임무 완료",
      "Complete the Natural History Museum of New York mission.",
    ),
    sources: [sources.ghostTour],
    image: { file: "ghost-tour-weapon-skin.png", width: 143, height: 135 },
  },
  {
    id: "arg-backpack",
    group: "arg",
    name: localized("폴의 백팩", "Paul’s Backpack"),
    kind: localized("외형 백팩", "Cosmetic backpack"),
    condition: argCode,
    sources: [sources.arg],
    image: { file: "arg-backpack.png", width: 110, height: 141 },
  },
  {
    id: "arg-cup",
    group: "arg",
    name: localized("케르만 카페 머그컵", "Kerman’s Coffee Cup"),
    kind: localized("백팩 장식", "Backpack trophy"),
    condition: argCode,
    sources: [sources.arg],
    image: { file: "arg-cup.png", width: 99, height: 147 },
  },
  {
    id: "paper-route-cap",
    group: "arg",
    name: localized("페이퍼 루트 캡모자", "The Paper Route Cap"),
    kind: localized("모자", "Cap"),
    condition: promoCode,
    sources: [sources.paperRoute],
    image: { file: "paper-route-cap.png", width: 190, height: 129 },
  },
  {
    id: "paper-route-jacket",
    group: "arg",
    name: localized("페이퍼 루트 재킷", "The Paper Route Jacket"),
    kind: localized("재킷", "Jacket"),
    condition: promoCode,
    sources: [sources.paperRoute],
    image: { file: "paper-route-jacket.png", width: 183, height: 163 },
  },
];
