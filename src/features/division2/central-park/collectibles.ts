import type { Localized } from "./rewards";

export const collectiblesId = "central-park-collectibles";

export const guardianCardsSource = "https://itemlevel.net/the-division-2-how-to-unlock-the-secret-clockwork-smg-all-guardian-card-locations/";

export const guardianCards: readonly { id: string; name: Localized; hint: Localized }[] = [
  {
    id: "guardian-stag",
    name: { ko: "수사슴", en: "The Stag" },
    hint: {
      ko: "센트럴 파크 캠페인 임무를 처음 완료하면 자동으로 등록돼요.",
      en: "Complete the Central Park campaign mission for the first time to receive this card automatically.",
    },
  },
  {
    id: "guardian-porcupine",
    name: { ko: "포큐파인", en: "The Porcupine" },
    hint: {
      ko: "쏜 구역 건물 주변의 켜진 촛불 네 곳과 상호작용하세요. 건물 근처 수풀에 가려진 통로를 따라가면 동굴에서 카드를 찾을 수 있어요.",
      en: "Interact with four sets of lit candles around the buildings in Thorn’s area. Follow the path hidden in the bushes to find the card in a cave.",
    },
  },
  {
    id: "guardian-toad",
    name: { ko: "토드", en: "The Toad" },
    hint: {
      ko: "공원 남쪽 마이어 구역에서 도로변 굴착기를 지나 옆으로 쓰러진 트럭을 넘어가세요. 안쪽의 수집 지점과 상호작용하세요.",
      en: "In Mire’s area in the south of the park, pass the roadside excavator and climb over the overturned truck to reach the pickup.",
    },
  },
  {
    id: "guardian-carrion-eater",
    name: { ko: "시체 청소부", en: "The Carrion Eater" },
    hint: {
      ko: "게임 내 21시 이후 벌처 구역에서 빛나는 에메랄드와 ‘Emerald’ 표지판 네 개를 쏘세요. 어린이집이 열리면 안의 토템을 조사하세요.",
      en: "After 21:00 in-game, shoot the glowing emerald and four Emerald signs in Vulture’s area. When the daycare opens, interact with the totem inside.",
    },
  },
  {
    id: "guardian-owl",
    name: { ko: "올빼미", en: "The Owl" },
    hint: {
      ko: "스펙터 구역의 숨은 미로로 들어가 토템을 조사하세요. 게임 내 낮에 들어가면 토템까지 도달할 시간이 더 길어요.",
      en: "Find the hidden maze in Specter’s area and interact with the totem. Enter during in-game daylight for more time to reach it.",
    },
  },
  {
    id: "guardian-spider",
    name: { ko: "스파이더", en: "The Spider" },
    hint: {
      ko: "할로우 구역에서 택시가 있는 입구 두 곳을 찾으세요. 입구가 막혀 있다면 게임 내 03~05시에 진입할 수 있었다는 사례가 있어요.",
      en: "Look for the two entrances marked by taxis in Hollow’s area. If they are blocked, players have reported getting through between 03:00 and 05:00 in-game.",
    },
  },
];
