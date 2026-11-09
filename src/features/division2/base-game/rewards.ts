import type { RewardSection, RewardSource } from "../reward-checklist-types";

export const baseGameLaunchSource: RewardSource = {
  href: "https://news.ubisoft.com/en-us/article/5gguy1pfxxM7mrCw1vjjQC/the-division-2-available-now-on-xbox-one-pc-and-ps4",
  label: { ko: "Ubisoft 공식 출시 안내", en: "Ubisoft’s launch announcement" },
};

const hunterGuide = "https://www.youtube.com/watch?v=FCUdBUzIrVg";

const hunterEncounters = [
  {
    masks: [["demon", "Demon Mask"]], seconds: 52, time: "0:52",
    requirement: {
      ko: "다운타운 이스트의 DC-62 연구소 격리 구역 보조 임무를 완료하세요. 같은 건물의 아트리움으로 돌아가 창가의 표적 네 개를 위에서 아래로 쏜 뒤 헌터를 처치하세요.",
      en: "Finish the DC-62 Lab Quarantine side mission in Downtown East. Return to the atrium, shoot the four window targets from top to bottom, and defeat the Hunter.",
    },
  },
  {
    masks: [["ghoul", "Ghoul Mask"]], seconds: 193, time: "3:13",
    requirement: {
      ko: "웨스트 포토맥 공원 지하에서 노트북을 작동하세요. 밤에 지도가 가리킨 물가로 가서 깜빡이는 전구를 쏘고 헌터를 처치하세요.",
      en: "Activate the laptop in the tunnels beneath West Potomac Park. After dark, go to the waterside spot it marks, shoot the flickering bulb, and defeat the Hunter.",
    },
  },
  {
    masks: [["wraith", "Wraith Mask"]], seconds: 345, time: "5:45",
    requirement: {
      ko: "밤에 사우스웨스트의 추모비에서 왼쪽 조명을 쏘세요. 물 밖으로 나와 깃발 뒤에서 추모비에 경례한 뒤 헌터를 처치하세요.",
      en: "After dark, shoot out the memorial’s left spotlight in Southwest. Step out of the water behind the flag, salute the memorial, and defeat the Hunter.",
    },
  },
  {
    masks: [["crimson", "Crimson Mask"]], seconds: 445, time: "7:25",
    requirement: {
      ko: "다운타운 이스트의 디스트릭트 유니언 경기장 남쪽 건물에서 무전기와 맞은편 전화기를 차례로 사용하세요. 안뜰에 나타난 헌터를 처치하세요.",
      en: "Use the radio and then the phone across the courtyard in the building south of District Union Arena. Defeat the Hunter that appears in the courtyard.",
    },
  },
  {
    masks: [["specter", "Specter Mask"]], seconds: 560, time: "9:20",
    requirement: {
      ko: "밤에 농무부 건물 앞 트럭에서 공략의 창문 순서대로 사격해 헌터를 소환하고 처치하세요.",
      en: "After dark, stand on the truck outside the Department of Agriculture, shoot the windows in the order shown in the guide, and defeat the Hunter.",
    },
  },
  {
    masks: [["midas", "Midas Mask"], ["revenant", "Revenant Mask"]], seconds: 680, time: "11:20",
    requirement: {
      ko: "포토맥 이벤트 센터 임무를 완료하세요. 밤에 웨스트 엔드의 수영장 안에서 팔 벌려 뛰기 감정표현을 사용한 뒤 두 헌터를 처치하세요.",
      en: "Complete the Potomac Event Center mission. After dark, use Jumping Jacks inside the West End pool and defeat both Hunters.",
    },
  },
  {
    masks: [["death", "Death Mask"], ["phantom", "Phantom Mask"], ["cross", "Cross Mask"], ["diamond", "Diamond Mask"]], seconds: 810, time: "13:30",
    requirement: {
      ko: "밤에 이스트 몰의 싱크홀 통제 지점 북쪽 카페에서 레버를 당기세요. 밖으로 나와 크리스마스트리를 돌면 나타나는 헌터 네 명을 처치하세요.",
      en: "After dark, pull the café lever north of the Sinkhole control point in East Mall. Circle the Christmas tree outside and defeat the four Hunters.",
    },
  },
  {
    masks: [["ghost", "Ghost Mask"]], seconds: 1016, time: "16:56",
    requirement: {
      ko: "밤에 워싱턴 기념탑 통제 지점의 지하 단말기를 사용한 뒤 요원 묘지 세 곳에서 경례하세요. 단말기로 돌아가 다시 작동하고 기념탑 밖 주황색 원에 들어가 헌터를 처치하세요.",
      en: "After dark, use the underground terminal at the Washington Monument control point and salute at the three agents’ graves. Use the terminal again, enter the orange circle outside, and defeat the Hunter.",
    },
  },
] as const;

const ivoryChestRequirement = {
  ko: "상아 열쇠 8개로 백악관 1층 이발소 옆 무기 상자를 여세요.",
  en: "Use eight Ivory Keys to open the weapon case beside the barber on the White House ground floor.",
};

export const baseGameSections = [
  {
    id: "dc-hunter-masks", tier: "core",
    title: { ko: "워싱턴 D.C. 헌터 마스크", en: "Washington, D.C. Hunter masks" },
    note: {
      ko: "본편의 헌터 마스크 12개입니다. 마스크는 하나씩 체크하고, 상아 열쇠는 두 명 이상이 동시에 나오는 경우에도 조우 단위로 모으세요.",
      en: "Track the 12 original Hunter masks individually. Collect Ivory Keys by encounter, including those that spawn multiple Hunters.",
    },
    links: [{ href: hunterGuide, label: { ko: "NothingButSkillz · 헌터 마스크 12개 공략", en: "NothingButSkillz · All 12 Hunter masks" } }],
    items: hunterEncounters.flatMap(({ masks, seconds, time, requirement }) => masks.map(([id, name]) => ({
      id: `hunter-${id}`, group: "dc-hunter-masks",
      name: { ko: name, en: name }, localizedNameUnconfirmed: true,
      requirement,
      links: [{
        href: `${hunterGuide}&t=${seconds}s`,
        label: { ko: `NothingButSkillz · 소환 위치와 순서 (${time})`, en: `NothingButSkillz · Encounter walkthrough (${time})` },
      }],
    }))),
  },
  {
    id: "ivory-chest", tier: "core",
    title: { ko: "백악관 상아 열쇠 상자", en: "White House Ivory Key case" },
    note: {
      ko: "워싱턴 D.C. 헌터 조우에서 모은 상아 열쇠 8개로 상자 하나를 열어 세 보상을 함께 받을 수 있어요.",
      en: "The eight Ivory Keys from the Washington, D.C. Hunter encounters open one case with all three rewards.",
    },
    links: [{
      href: "https://holdtoreset.com/THE-DIVISION-2-WHAT-TO-DO-WITH-IVORY-KEYS/",
      label: { ko: "Hold To Reset · 상자 위치와 구성품", en: "Hold To Reset · Case location and contents" },
    }],
    items: [
      {
        id: "shield-splinterer", group: "ivory-chest",
        name: { ko: "Shield Splinterer", en: "Shield Splinterer" }, localizedNameUnconfirmed: true,
        requirement: ivoryChestRequirement,
        note: { ko: "네임드 F2000 돌격소총", en: "Named F2000 assault rifle" },
      },
      {
        id: "ivory-weapon-skin", group: "ivory-chest",
        name: { ko: "Ivory weapon skin", en: "Ivory weapon skin" }, localizedNameUnconfirmed: true,
        requirement: ivoryChestRequirement,
        note: { ko: "상아색 무기 스킨", en: "Ivory-colored weapon finish" },
      },
      {
        id: "hunters-axe", group: "ivory-chest",
        name: { ko: "Hunter’s Axe", en: "Hunter’s Axe" }, localizedNameUnconfirmed: true,
        requirement: ivoryChestRequirement,
        note: { ko: "백팩 장식", en: "Backpack trophy" },
      },
    ],
  },
  {
    id: "exotic-crafting", tier: "bonus",
    title: { ko: "제작으로 얻는 특급 장비", en: "Selected exotic crafting quests" },
    note: {
      ko: "워싱턴 D.C.에서 설계도와 부품을 모아 만들 수 있는 특급 장비 중 네 가지를 골랐어요. 네메시스는 주간 침입 편성에 따라 여러 주가 걸릴 수 있어요.",
      en: "Four selected exotics you can craft from blueprints and components in Washington, D.C. Nemesis can take several weeks depending on the invasion rotation.",
    },
    links: [{
      href: "https://www.ubisoft.com/ko-kr/game/the-division/the-division-2/news-updates/5dLawL7Hi5x0EQc9Jp4T0u/division-pts-73",
      label: { ko: "Ubisoft · 특급 제작 장비 한글 명칭", en: "Ubisoft · Official Korean item names" },
    }],
    items: [
      {
        id: "chatterbox", group: "exotic-crafting",
        name: { ko: "촉새", en: "The Chatterbox" },
        requirement: {
          ko: "다운타운 이스트, 페더럴 트라이앵글, 주디셔리 스퀘어의 하이에나 상자에서 부품을 하나씩 모으세요. 은행 본부 금고에서 설계도를 얻은 뒤 제작하세요.",
          en: "Collect one part from Hyena caches in each of Downtown East, Federal Triangle, and Judiciary Square. Get the blueprint in the Bank Headquarters vault, then craft the weapon.",
        },
        links: [{
          href: "https://www.youtube.com/watch?v=Vas27aFF33A",
          label: { ko: "McWayne · 부품과 설계도 공략", en: "McWayne · Component and blueprint walkthrough" },
        }, {
          href: "https://www.shacknews.com/article/111103/how-to-get-the-chatterbox-exotic-smg-the-division-2",
          label: { ko: "Shacknews · 하이에나 상자 위치", en: "Shacknews · Hyena cache locations" },
        }],
      },
      {
        id: "liberty", group: "exotic-crafting",
        name: { ko: "자유", en: "Liberty" },
        requirement: {
          ko: "국회의사당, 미국 역사 박물관, 뷰포인트 박물관, 우주국 본부 순으로 보스를 처치해 부품과 설계도를 모으세요. 고급 D50 권총을 재료로 사용해 제작하세요.",
          en: "Defeat the bosses in Capitol Building, American History Museum, ViewPoint Museum, and Space Administration HQ in that order. Craft Liberty using the recovered parts, blueprint, and a High-End D50.",
        },
        links: [{
          href: "https://www.youtube.com/watch?v=YvM-5q5TYjM",
          label: { ko: "NothingButSkillz · 권총 제작 공략", en: "NothingButSkillz · Pistol crafting walkthrough" },
        }],
      },
      {
        id: "nemesis", group: "exotic-crafting",
        name: { ko: "네메시스", en: "Nemesis" },
        requirement: {
          ko: "타이들 베이슨의 잠긴 방에서 Adrestia SR-1을 찾아 분해하세요. 침입 요새에서 나머지 부품을 모으고, 침입 그랜드 워싱턴 호텔의 퍼크에게서 설계도를 얻어 제작하세요.",
          en: "Find and dismantle the Adrestia SR-1 in the locked room at Tidal Basin. Collect the remaining parts from invaded strongholds and get the crafting blueprint from Puck at the invaded Grand Washington Hotel.",
        },
        note: { ko: "퍼크를 잡기 전에 부품을 2개 이상 모으세요.", en: "Collect at least two components before going after Puck." },
        links: [{
          href: "https://www.pcgamer.com/how-to-get-the-nemesis-exotic-rifle-in-the-division-2/",
          label: { ko: "PC Gamer · 잠긴 방과 침입 요새 공략", en: "PC Gamer · Locked room and invaded strongholds" },
        }, {
          href: "https://www.reddit.com/r/Division2/comments/1sn5dfd/how_to_get_the_nemesis_blueprint/",
          label: { ko: "r/Division2 · 설계도 획득 경로 확인", en: "r/Division2 · Blueprint route confirmation" },
        }],
      },
      {
        id: "dodge-city-gunslingers-holster", group: "exotic-crafting",
        name: { ko: "닷지 시티의 총잡이 권총집", en: "Dodge City Gunslinger’s Holster" },
        requirement: {
          ko: "백악관에서 이나야의 프로젝트를 시작하세요. 리버사이드 주유소와 적 세력의 4단계 통제 지점에서 부품을 모은 뒤, 게임 내 정오에 백악관 동쪽 술집의 후속 프로젝트를 완료해 제작하세요.",
          en: "Start Inaya’s project at the White House. Collect parts from Riverside Gas Station and level-four faction control points, then finish the follow-up project at the bar east of the White House at in-game noon and craft the holster.",
        },
        links: [{
          href: "https://www.youtube.com/watch?v=qXzYgA8MBqY",
          label: { ko: "GCROCK · 권총집 프로젝트 공략", en: "GCROCK · Holster project walkthrough" },
        }],
      },
    ],
  },
] satisfies readonly RewardSection[];
