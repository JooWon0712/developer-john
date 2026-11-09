import type { RewardItem, RewardSection, RewardSource } from "../reward-checklist-types";

export const warlordsLaunchSource: RewardSource = {
  href: "https://news.ubisoft.com/en-us/article/7cdnnVWfLdNvvFJYoHkkzT/the-division-2-warlords-of-new-york-out-now",
  label: { ko: "Ubisoft 공식 출시 안내", en: "Ubisoft launch announcement" },
};

const skillGuide: RewardSource = {
  href: "https://gameranx.com/features/id/193418/article/division-2-warlords-of-new-york-how-to-unlock-4-new-dlc-skills/",
  label: { ko: "Gameranx · 캠페인 스킬 해금", en: "Gameranx · campaign skill unlocks" },
};

const hunterVideo = "https://www.youtube.com/watch?v=fzHBsCdcV7M";

const hunterGuide: RewardSource = {
  href: "https://steamcommunity.com/sharedfiles/filedetails/?id=3009550728&l=english",
  label: { ko: "Steam 커뮤니티 · 헌터 퍼즐과 상자 공략", en: "Steam Community · Hunter puzzles and chest guide" },
};

function hunterWalkthrough(seconds: number, time: string): RewardSource {
  return {
    href: `${hunterVideo}&t=${seconds}s`,
    label: {
      ko: `NothingButSkillz · 공략 (${time})`,
      en: `NothingButSkillz · walkthrough (${time})`,
    },
  };
}

const hunterEncounters: readonly {
  masks: readonly { id: string; name: RewardItem["name"] }[];
  requirement: RewardItem["requirement"];
  video: RewardSource;
}[] = [
  {
    masks: [{ id: "hunter-angel", name: { ko: "엔젤", en: "Angel" } }],
    requirement: {
      ko: "워싱턴 D.C.에서 사자 눈을 모아 사자상 퍼즐을 풀고 헌터를 처치하세요.",
      en: "Collect the lion eyes in Washington, D.C., solve the lion statue puzzle, and defeat the Hunter.",
    },
    video: hunterWalkthrough(41, "0:41"),
  },
  {
    masks: [{ id: "hunter-camo", name: { ko: "카모", en: "Camo" } }],
    requirement: {
      ko: "워싱턴 D.C.에서 조명 퍼즐을 풀고 헌터를 처치하세요.",
      en: "Solve the spotlight puzzle in Washington, D.C. and defeat the Hunter.",
    },
    video: hunterWalkthrough(549, "9:09"),
  },
  {
    masks: [{ id: "hunter-divide", name: { ko: "디바이드", en: "Divide" } }],
    requirement: {
      ko: "뉴욕에서 깃발을 모아 퍼즐을 풀고 헌터를 처치하세요.",
      en: "Collect the flags in New York, solve their puzzle, and defeat the Hunter.",
    },
    video: hunterWalkthrough(771, "12:51"),
  },
  {
    masks: [
      { id: "hunter-weirdo", name: { ko: "위어도", en: "Weirdo" } },
      { id: "hunter-drama", name: { ko: "드라마", en: "Drama" } },
    ],
    requirement: {
      ko: "워싱턴 D.C.에서 크리스마스 선물을 모아 시장의 퍼즐을 풀고 헌터 2명을 처치하세요.",
      en: "Collect the Christmas presents in Washington, D.C., solve the market puzzle, and defeat both Hunters.",
    },
    video: hunterWalkthrough(1111, "18:31"),
  },
  {
    masks: [{ id: "hunter-carbon", name: { ko: "카본", en: "Carbon" } }],
    requirement: {
      ko: "워싱턴 D.C.에서 하수도 전기 상자와 주디셔리 스퀘어의 노트북을 이용해 헌터를 소환한 뒤 처치하세요.",
      en: "Use the sewer power boxes and a laptop in Judiciary Square to summon and defeat the Hunter in Washington, D.C.",
    },
    video: hunterWalkthrough(1361, "22:41"),
  },
  {
    masks: [
      { id: "hunter-drip", name: { ko: "드립", en: "Drip" } },
      { id: "hunter-psycho", name: { ko: "사이코", en: "Psycho" } },
    ],
    requirement: {
      ko: "뉴욕의 빨래방에서 시작하는 퍼즐로 소환되는 헌터 2명을 처치하세요.",
      en: "Defeat both Hunters summoned by the puzzle that starts at the laundromat in New York.",
    },
    video: hunterWalkthrough(1795, "29:55"),
  },
  {
    masks: [{ id: "hunter-neurotic", name: { ko: "뉴로틱", en: "Neurotic" } }],
    requirement: {
      ko: "뉴욕 배터리 파크에서 게임 내 시간에 맞춰 퍼즐을 풀고 헌터를 처치하세요.",
      en: "Follow the in-game time windows for the Battery Park puzzle in New York and defeat the Hunter.",
    },
    video: hunterWalkthrough(2320, "38:40"),
  },
  {
    masks: [
      { id: "hunter-trip", name: { ko: "트립", en: "Trip" } },
      { id: "hunter-lucky", name: { ko: "럭키", en: "Lucky" } },
      { id: "hunter-veil", name: { ko: "베일", en: "Veil" } },
      { id: "hunter-paranoid", name: { ko: "패러노이드", en: "Paranoid" } },
    ],
    requirement: {
      ko: "뉴욕에서 크리스마스 장식과 사격 표적 퍼즐을 풀고 소환된 헌터 4명을 처치하세요.",
      en: "Complete the Christmas decoration and shooting target puzzles in New York and defeat all four Hunters.",
    },
    video: hunterWalkthrough(2499, "41:39"),
  },
];

export const warlordsSections = [
  {
    id: "campaign-skills",
    tier: "core",
    title: { ko: "캠페인 스킬", en: "Campaign skills" },
    note: {
      ko: "뉴욕 캠페인의 주요 표적 4명을 각각 처치하면 스킬 변형을 하나씩 해금할 수 있어요.",
      en: "Defeat the four main New York campaign targets to unlock one skill variant from each.",
    },
    links: [skillGuide],
    items: [
      {
        id: "burn-sticky-bomb",
        group: "campaign-skills",
        name: { ko: "소이 점착 폭탄", en: "Burn Sticky Bomb" },
        requirement: {
          ko: "좌초된 유조선(Stranded Tanker) 임무에서 비비안 콘리를 처치하세요.",
          en: "Defeat Vivian Conley in the Stranded Tanker mission.",
        },
        localizedNameUnconfirmed: true,
      },
      {
        id: "explosive-sticky-bomb",
        group: "campaign-skills",
        name: { ko: "폭발 점착 폭탄", en: "Explosive Sticky Bomb" },
        requirement: {
          ko: "월 스트리트(Wall Street) 임무에서 제임스 드라고프를 처치하세요.",
          en: "Defeat James Dragov in the Wall Street mission.",
        },
        localizedNameUnconfirmed: true,
      },
      {
        id: "shock-trap",
        group: "campaign-skills",
        name: { ko: "충격 덫", en: "Shock Trap" },
        requirement: {
          ko: "패스웨이 파크(Pathway Park) 임무에서 하비에르 카지카를 처치하세요.",
          en: "Defeat Javier Kajika in the Pathway Park mission.",
        },
        localizedNameUnconfirmed: true,
      },
      {
        id: "decoy",
        group: "campaign-skills",
        name: { ko: "미끼", en: "Decoy" },
        requirement: {
          ko: "더 툼스(The Tombs) 임무에서 테오 파넬을 처치하세요.",
          en: "Defeat Theo Parnell in The Tombs mission.",
        },
        localizedNameUnconfirmed: true,
      },
    ],
  },
  {
    id: "hunter-masks",
    tier: "core",
    title: { ko: "숨겨진 헌터 마스크", en: "Hidden Hunter masks" },
    note: {
      ko: "워싱턴 D.C.와 뉴욕의 헌터 조우 8곳에서 마스크 13개를 얻을 수 있어요. 각 조우에서 헤이븐 상자를 여는 오프 화이트 열쇠를 1개씩 얻어요.",
      en: "Eight Hunter encounters across Washington, D.C. and New York award 13 masks. Each encounter also awards one Off-White Key for the Haven chest.",
    },
    links: [hunterGuide],
    items: hunterEncounters.flatMap(({ masks, requirement, video }) =>
      masks.map((mask) => ({
        ...mask,
        group: "hunter-masks",
        requirement,
        links: [video],
        localizedNameUnconfirmed: true,
      })),
    ),
  },
  {
    id: "haven-chest",
    tier: "core",
    title: { ko: "헤이븐 정착지 상자", en: "Haven settlement chest" },
    note: {
      ko: "헌터 조우 8곳에서 얻은 오프 화이트 열쇠 8개로 헤이븐의 상자를 열면 두 보상을 함께 획득해요.",
      en: "Use all eight Off-White Keys from the Hunter encounters to open the chest at Haven and receive both rewards together.",
    },
    links: [hunterWalkthrough(3079, "51:19"), hunterGuide],
    items: [
      {
        id: "hunter-killer",
        group: "haven-chest",
        name: { ko: "헌터 킬러", en: "Hunter-Killer" },
        requirement: {
          ko: "헤이븐 상자에서 골란 기어의 네임드 가슴 보호대를 획득하세요.",
          en: "Collect the named Golan Gear chest piece from the Haven chest.",
        },
        localizedNameUnconfirmed: true,
      },
      {
        id: "full-black-gear-dye",
        group: "haven-chest",
        name: { ko: "완전 검정", en: "Full Black" },
        requirement: {
          ko: "헤이븐 상자에서 보호장구 염색을 획득하세요.",
          en: "Collect the gear dye from the Haven chest.",
        },
        localizedNameUnconfirmed: true,
      },
    ],
  },
  {
    id: "mission-exotics",
    tier: "bonus",
    title: { ko: "뉴욕 임무 특급 장비", en: "New York mission exotics" },
    note: {
      ko: "뉴욕에서 노릴 수 있는 확률 보상이에요. 임무를 완료해도 매번 지급되지는 않아요.",
      en: "These exotics have a chance to drop from New York missions. Completing a mission does not guarantee a drop.",
    },
    items: [
      {
        id: "bullet-king",
        group: "mission-exotics",
        name: { ko: "탄환 제왕", en: "Bullet King" },
        requirement: {
          ko: "월 스트리트 또는 더 툼스에서 라이커 보스에게서 특급 경기관총을 노려보세요.",
          en: "Farm Rikers bosses in Wall Street or The Tombs for the exotic light machine gun.",
        },
        links: [{
          href: "https://www.youtube.com/watch?v=Ag1HA7uUxfY&t=237s",
          label: { ko: "Destin · 탄환 제왕 획득 공략 (3:57)", en: "Destin · Bullet King farming guide (3:57)" },
        }],
      },
      {
        id: "imperial-dynasty",
        group: "mission-exotics",
        name: { ko: "제국의 왕가", en: "Imperial Dynasty" },
        requirement: {
          ko: "좌초된 유조선 또는 패스웨이 파크에서 클리너 보스에게서 특급 권총집을 노려보세요.",
          en: "Farm Cleaners bosses in Stranded Tanker or Pathway Park for the exotic holster.",
        },
        links: [{
          href: "https://www.youtube.com/watch?v=Ag1HA7uUxfY&t=327s",
          label: { ko: "Destin · 제국의 왕가 획득 공략 (5:27)", en: "Destin · Imperial Dynasty farming guide (5:27)" },
        }],
      },
    ],
  },
] satisfies readonly RewardSection[];
