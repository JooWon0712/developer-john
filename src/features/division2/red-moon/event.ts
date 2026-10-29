export type CheckType = "reward" | "bounty" | "owned";
export type RewardCheck = { id: string; label: string; type: CheckType };
export type RewardNotice = { title: string; paragraphs: string[]; publishedOn: string; checkedOn: string; period: { title: string; startsOn: string; endsOn: string }; links: { label: string; href: string }[] };
export type RewardEntry = { id: string; title: string; detail?: string; tag?: string; search?: string; apparel?: boolean; notice?: RewardNotice; checks: RewardCheck[] };
export type RewardGroup = { id: string; category: string; title: string; description: string; entries: RewardEntry[] };
export type RewardImage = { src: string; width: number; height: number; title: string; kind?: "cosmetic" | "vfx"; evidence?: string; source?: string };

// Public event facts; Korean names follow supplied in-game screens. Personal progress stays separate.
// Date-only event schedule: exact end time/time zone is unverified.
export const event = {
  "id": "red-moon-unleashed-2026",
  "slug": "red-moon-unleashed-2026",
  "title": "레드 문 언리시드 보상 가이드",
  "path": "/services/game/the-division-2/red-moon-unleashed-2026",
  "startsOn": "2026-10-15",
  "endsOn": "2026-11-03",
  "dropsStartsOn": "2026-10-15",
  "dropsEndsOn": "2026-10-22",
  "verifiedAt": "2026-10-29",
  "sources": [
    {
      "title": "Ubisoft 공식 이벤트 안내",
      "url": "https://www.ubisoft.com/en-us/game/the-division/the-division-2/news-updates/7uzKuy4iB0MtOJfsXAr3TO/tuy8s32-red-moon-unleashed-creator-collaboration-escalation-updates-more"
    },
    {
      "title": "Ubisoft 한국어 Twitch 드롭스 안내",
      "url": "https://www.ubisoft.com/ko-kr/game/the-division/the-division-2/news-updates/VLVLB9xFr5sLxAtZSVM6J/2-twitch"
    }
  ]
};

export const categories: { id: string; title: string }[] = [
  {
    "id": "all",
    "title": "전체 항목"
  },
  {
    "id": "bounty",
    "title": "현상수배"
  },
  {
    "id": "boss",
    "title": "확률 출현 보스"
  },
  {
    "id": "collect",
    "title": "기부·접속"
  },
  {
    "id": "apparel",
    "title": "의류 상자"
  },
  {
    "id": "drops",
    "title": "드롭스·협업"
  },
  {
    "id": "owned",
    "title": "주요 장비 보유"
  }
];

export const groups: RewardGroup[] = [
  {
    "id": "bounties",
    "category": "bounty",
    "title": "돌아온 현상수배 6종",
    "description": "완료 시 열쇠 1개 · 전용 팔 휘장 확률 50% · 특급 무기 20% 또는 특급 상자 80% · 특급 무기는 드롭 안내로만 표시해요.",
    "entries": [
      {
        "id": "bounty-final",
        "title": "마지막 생존자",
        "detail": "표적 카버 · 서부 다운타운",
        "tag": "특급 무기 · 레굴루스 (20%)",
        "search": "Final Girl / The Carver 카버 팔 휘장",
        "checks": [
          {
            "id": "bounty-final",
            "label": "현상수배 완료",
            "type": "bounty"
          },
          {
            "id": "patch-final",
            "label": "전용 팔 휘장 수령",
            "type": "reward"
          }
        ]
      },
      {
        "id": "bounty-scarecrow",
        "title": "허수아비",
        "detail": "표적 역병 의사 · 서부 다운타운",
        "tag": "특급 무기 · 프리마돈나 (20%)",
        "search": "Scarecrow / The Raven 까마귀 팔 휘장",
        "checks": [
          {
            "id": "bounty-scarecrow",
            "label": "현상수배 완료",
            "type": "bounty"
          },
          {
            "id": "patch-scarecrow",
            "label": "전용 팔 휘장 수령",
            "type": "reward"
          }
        ]
      },
      {
        "id": "bounty-dousing",
        "title": "암전",
        "detail": "표적 바보의 빛 · 백악관",
        "tag": "특급 무기 · 빅혼 (20%)",
        "search": "Dousing the Light / The Fool’s Light 바보의 빛 팔 휘장",
        "checks": [
          {
            "id": "bounty-dousing",
            "label": "현상수배 완료",
            "type": "bounty"
          },
          {
            "id": "patch-dousing",
            "label": "전용 팔 휘장 수령",
            "type": "reward"
          }
        ]
      },
      {
        "id": "bounty-binding",
        "title": "결박의 원",
        "detail": "표적 결박된 자 · 동부 다운타운",
        "tag": "특급 무기 · 스틸 앤 선즈 ACR (20%)",
        "search": "Binding Circle / The Bound 결박된 자 팔 휘장",
        "checks": [
          {
            "id": "bounty-binding",
            "label": "현상수배 완료",
            "type": "bounty"
          },
          {
            "id": "patch-binding",
            "label": "전용 팔 휘장 수령",
            "type": "reward"
          }
        ]
      },
      {
        "id": "bounty-blinding",
        "title": "맹목",
        "detail": "표적 불타는 눈 · 동부 다운타운",
        "tag": "특급 무기 · 독수리를 거느린 자 (20%)",
        "search": "Blinding the Eye / The Burning Eye 불타는 눈 팔 휘장",
        "checks": [
          {
            "id": "bounty-blinding",
            "label": "현상수배 완료",
            "type": "bounty"
          },
          {
            "id": "patch-blinding",
            "label": "전용 팔 휘장 수령",
            "type": "reward"
          }
        ]
      },
      {
        "id": "bounty-rubber",
        "title": "러버 앤 글루",
        "detail": "표적 조롱꾼 · 컨스티튜션 홀",
        "tag": "특급 무기 · 빈디케이터 (20%)",
        "search": "Rubber and Glue / The Mocker 조롱꾼 팔 휘장",
        "checks": [
          {
            "id": "bounty-rubber",
            "label": "현상수배 완료",
            "type": "bounty"
          },
          {
            "id": "patch-rubber",
            "label": "전용 팔 휘장 수령",
            "type": "reward"
          }
        ]
      }
    ]
  },
  {
    "id": "all-six",
    "category": "bounty",
    "title": "현상수배 전체 완료 보상",
    "description": "현상수배 6종 처치 후 진행 상황 → 공훈에서 보상을 직접 수령하세요. 개별 팔 휘장 6종 수집과는 별개예요.",
    "entries": [
      {
        "id": "patch-all-six",
        "title": "강령술사 팔 휘장",
        "detail": "공훈: Red Moon Distinction · 현상수배 6종 완료 · 팔 휘장 + 공훈 점수 30점",
        "checks": [
          {
            "id": "patch-all-six",
            "label": "팔 휘장 수령",
            "type": "reward"
          }
        ],
        "search": "Necromancer Arm Patch 네크로맨서 암 패치 Red Moon Revenants Defeated"
      }
    ]
  },
  {
    "id": "bosses",
    "category": "boss",
    "title": "확률 출현 보스",
    "description": "아래 외형은 의류 상자 43종과 별도예요. 확인한 한국어 이름을 우선하고 미확인 이름은 영문으로 표시해요.",
    "entries": [
      {
        "id": "mask-necro",
        "title": "강령술사",
        "detail": "전용 마스크: 결박된 강령술사 · 열쇠 1개 · 사루 20% 또는 특급 상자 80%",
        "checks": [
          {
            "id": "mask-necro",
            "label": "결박된 강령술사 수령",
            "type": "reward"
          }
        ],
        "tag": "Necromancer",
        "search": "Bound Necromancer Mask 강령술사 전용 마스크"
      },
      {
        "id": "mask-risen",
        "title": "부활한 헌터",
        "detail": "전용 마스크: 결박된 헌터 마스크 · 열쇠 1개 · 버티고 20% 또는 특급 상자 80%",
        "checks": [
          {
            "id": "mask-risen",
            "label": "결박된 헌터 마스크 수령",
            "type": "reward"
          }
        ],
        "tag": "Risen Hunter",
        "search": "Bound Risen Hunter Mask 부활한 헌터 전용 마스크"
      },
      {
        "id": "mask-houndsman",
        "title": "핏빛개 사냥꾼",
        "detail": "열쇠 드롭 없음 · 박쥐 시각효과는 모든 드론 변형에 사용 가능 · 전용 의상은 아래 드롭 문제·별도 지급 안내를 확인하세요. 외형의 실제 지급을 확인한 뒤 각각 체크하세요.",
        "tag": "Bloody Houndsman",
        "search": "Bat Drone Skill VFX 박쥐 드론 시각효과 Bloody Houndsman Uniform 핏빛 사냥개 조련사 유니폼 유니폼 버그",
        "notice": {
          "title": "전용 의상 드롭 문제·별도 지급 안내",
          "paragraphs": [
            "전용 의상(Bloody Houndsman Uniform)은 공식 처치 보상 목록에 있지만, 10월 15일 공지에서 처치 후 드롭되지 않는 알려진 문제가 안내됐어요.",
            "대응으로 아래 기간에 게임에 접속한 모든 플레이어에게 해당 유니폼을 지급한다고 공지했어요. 메인 이벤트(10.15~11.03)와 별도 기간이에요.",
            "공지의 지급 대상은 유니폼이에요. 정확한 지급 시점·수령 경로와 버그 수정 완료 여부는 해당 공지에 명시되지 않았어요. 실제 지급을 확인한 뒤 전용 의상 수령을 체크하세요. 다른 외형도 각각 수령 여부를 확인하세요."
          ],
          "publishedOn": "2026-10-15",
          "checkedOn": "2026-10-29",
          "period": { "title": "유니폼 별도 지급 대상 접속 기간", "startsOn": "2026-10-29", "endsOn": "2026-11-10" },
          "links": [
            { "label": "공식 X 공지", "href": "https://x.com/TheDivisionGame/status/2110706685081739592" },
            { "label": "공식 버그 신고 TCTD2-8273", "href": "https://www.ubisoft.com/en-us/game/the-division/the-division-2/bug-reporter/issues/TCTD2-8273" }
          ]
        },
        "checks": [
          {
            "id": "mask-houndsman",
            "label": "핏빛 사냥개 조련사 마스크 수령",
            "type": "reward"
          },
          {
            "id": "gloves-houndsman",
            "label": "핏빛 사냥개 조련사 장갑 수령",
            "type": "reward"
          },
          {
            "id": "backpack-houndsman",
            "label": "핏빛 사냥개 조련사 백팩 수령",
            "type": "reward"
          },
          {
            "id": "uniform-houndsman",
            "label": "핏빛 사냥개 조련사 유니폼 수령",
            "type": "reward"
          },
          {
            "id": "vfx-drone",
            "label": "박쥐 드론 시각효과 수령",
            "type": "reward"
          }
        ]
      },
      {
        "id": "vfx-hive",
        "title": "Necromancer Unleashed",
        "detail": "전용 시각효과: 강령술사 하이브 · 모든 하이브 변형에 사용 가능 · West End (지역 한글명 미확인) · 솔로·영웅 처치 · 열쇠 1개 · 우로보로스 20% 또는 특급 상자 80%",
        "checks": [
          {
            "id": "vfx-hive",
            "label": "강령술사 하이브 시각효과 수령",
            "type": "reward"
          }
        ],
        "tag": "보스 한국어판 이름 미확인",
        "search": "네크로맨서 언리시드 Necromancer Hive Skill VFX"
      }
    ]
  },
  {
    "id": "login",
    "category": "collect",
    "title": "접속 보상",
    "description": "2026.10.15~11.03 이벤트 기간에 게임에 접속한 모든 플레이어에게 무료로 지급하는 보상이에요.",
    "entries": [
      {
        "id": "login-mask",
        "title": "결박된 슬래셔 마스크",
        "detail": "이벤트 기간에 디비전2에 접속한 뒤 의류 → 마스크에서 지급 여부를 확인하세요. 공식 공지에는 접속 시 무료 지급만 안내되어 있으며, 별도 수령 버튼이나 장소는 명시되어 있지 않아요.",
        "checks": [
          {
            "id": "login-mask",
            "label": "보상 수령",
            "type": "reward"
          }
        ],
        "tag": "기간 중 접속 · 무료 지급",
        "search": "Bound Slasher Mask"
      }
    ]
  },
  {
    "id": "donations",
    "category": "collect",
    "title": "개인 열쇠 기부",
    "description": "누적 200개 · 보급관에서 실제 수령한 보상을 체크하세요.",
    "entries": [
      {
        "id": "donate-10",
        "title": "불길한 주문 셔츠",
        "detail": "누적 열쇠 10개 기부",
        "checks": [
          {
            "id": "donate-10",
            "label": "보상 수령",
            "type": "reward"
          }
        ],
        "tag": "10개"
      },
      {
        "id": "donate-20",
        "title": "스콜피오",
        "detail": "누적 열쇠 20개 기부",
        "checks": [
          {
            "id": "donate-20",
            "label": "보상 수령",
            "type": "reward"
          }
        ],
        "tag": "20개"
      },
      {
        "id": "donate-40",
        "title": "불길한 주문 장갑",
        "detail": "누적 열쇠 40개 기부",
        "checks": [
          {
            "id": "donate-40",
            "label": "보상 수령",
            "type": "reward"
          }
        ],
        "tag": "40개"
      },
      {
        "id": "donate-60",
        "title": "BT 레드 문 부대",
        "detail": "누적 열쇠 60개 기부",
        "checks": [
          {
            "id": "donate-60",
            "label": "보상 수령",
            "type": "reward"
          }
        ],
        "tag": "60개"
      },
      {
        "id": "donate-80",
        "title": "불길한 주문 부츠",
        "detail": "누적 열쇠 80개 기부",
        "checks": [
          {
            "id": "donate-80",
            "label": "보상 수령",
            "type": "reward"
          }
        ],
        "tag": "80개"
      },
      {
        "id": "donate-100",
        "title": "관리자",
        "detail": "누적 열쇠 100개 기부",
        "checks": [
          {
            "id": "donate-100",
            "label": "보상 수령",
            "type": "reward"
          }
        ],
        "tag": "100개",
        "search": "Caretaker"
      },
      {
        "id": "donate-125",
        "title": "불길한 주문 바지",
        "detail": "누적 열쇠 125개 기부",
        "checks": [
          {
            "id": "donate-125",
            "label": "보상 수령",
            "type": "reward"
          }
        ],
        "tag": "125개"
      },
      {
        "id": "donate-150",
        "title": "블러드스톤",
        "detail": "누적 열쇠 150개 기부",
        "checks": [
          {
            "id": "donate-150",
            "label": "보상 수령",
            "type": "reward"
          }
        ],
        "tag": "150개",
        "search": "Caretaker Bloodstone"
      },
      {
        "id": "donate-175",
        "title": "불길한 주문 마스크",
        "detail": "누적 열쇠 175개 기부",
        "checks": [
          {
            "id": "donate-175",
            "label": "보상 수령",
            "type": "reward"
          }
        ],
        "tag": "175개"
      },
      {
        "id": "donate-200",
        "title": "불길한 주문",
        "detail": "누적 열쇠 200개 기부",
        "checks": [
          {
            "id": "donate-200",
            "label": "보상 수령",
            "type": "reward"
          }
        ],
        "tag": "200개",
        "search": "Sinister Spells Backpack Trophy"
      }
    ]
  },
  {
    "id": "community",
    "category": "collect",
    "title": "커뮤니티 기부 보상",
    "description": "전체 기부 목표 달성과 내 보상 수령은 별도예요.",
    "entries": [
      {
        "id": "community-jacket",
        "title": "바보의 빛 재킷",
        "detail": "커뮤니티 열쇠 전체 300만 개 기부 보상",
        "checks": [
          {
            "id": "community-jacket",
            "label": "보상 수령",
            "type": "reward"
          }
        ],
        "tag": "전체 300만 개",
        "search": "The Fool’s Light Jacket"
      },
      {
        "id": "community-pants",
        "title": "바보의 빛 바지",
        "detail": "커뮤니티 열쇠 전체 1,000만 개 기부 보상",
        "checks": [
          {
            "id": "community-pants",
            "label": "보상 수령",
            "type": "reward"
          }
        ],
        "tag": "전체 1,000만 개",
        "search": "The Fool’s Light Pants"
      },
      {
        "id": "community-mask",
        "title": "바보의 등불 마스크",
        "detail": "커뮤니티 열쇠 전체 2,000만 개 기부 보상",
        "checks": [
          {
            "id": "community-mask",
            "label": "보상 수령",
            "type": "reward"
          }
        ],
        "tag": "전체 2,000만 개",
        "search": "The Fool’s Lantern Mask"
      }
    ]
  },
  {
    "id": "apparel",
    "category": "apparel",
    "title": "의류 상자 · 43종",
    "description": "개별 43종의 이름은 아직 대조하지 않아 수량으로 관리해요. 수집 완료가 장식 수령 체크를 대신하지는 않아요.",
    "entries": [
      {
        "id": "apparel-trophy",
        "title": "43종 완성 보상",
        "detail": "강령술사 · 백팩 트로피 장식",
        "checks": [
          {
            "id": "apparel-trophy",
            "label": "완성 백팩 장식 수령",
            "type": "reward"
          }
        ],
        "apparel": true,
        "search": "The Necromancer Backpack Trophy 강령술사 백팩 트로피 장식"
      }
    ]
  },
  {
    "id": "twitch",
    "category": "drops",
    "title": "Twitch 드롭스",
    "description": "10월 15–22일 · 시청 시간 달성 후 Twitch에서 실제 수령한 보상을 체크하세요.",
    "entries": [
      {
        "id": "twitch-summon",
        "title": "소환 팔 휘장",
        "detail": "누적 시청 30분",
        "checks": [
          {
            "id": "twitch-summon",
            "label": "보상 수령",
            "type": "reward"
          }
        ]
      },
      {
        "id": "twitch-named",
        "title": "네임드 상자",
        "detail": "누적 시청 1시간",
        "checks": [
          {
            "id": "twitch-named",
            "label": "보상 수령",
            "type": "reward"
          }
        ]
      },
      {
        "id": "twitch-bind",
        "title": "속박 팔 휘장",
        "detail": "누적 시청 2시간",
        "checks": [
          {
            "id": "twitch-bind",
            "label": "보상 수령",
            "type": "reward"
          }
        ]
      },
      {
        "id": "twitch-exotic",
        "title": "특급 상자",
        "detail": "누적 시청 3시간",
        "checks": [
          {
            "id": "twitch-exotic",
            "label": "보상 수령",
            "type": "reward"
          }
        ]
      },
      {
        "id": "twitch-eye",
        "title": "눈 맞춤 무기 스킨",
        "detail": "누적 시청 4시간",
        "checks": [
          {
            "id": "twitch-eye",
            "label": "보상 수령",
            "type": "reward"
          }
        ]
      }
    ]
  },
  {
    "id": "creator-pureprime",
    "category": "drops",
    "title": "PurePrime 크리에이터 협업",
    "description": "프로젝트 보상과 전리품 외형을 각각 기록해요.",
    "entries": [
      {
        "id": "creator-pureprime-backpack",
        "title": "테마 백팩",
        "detail": "PurePrime 프로젝트 6개 완료",
        "checks": [
          {
            "id": "creator-pureprime-backpack",
            "label": "보상 수령",
            "type": "reward"
          }
        ]
      },
      {
        "id": "creator-pureprime-cap",
        "title": "모자",
        "detail": "PurePrime · 전리품 상자",
        "checks": [
          {
            "id": "creator-pureprime-cap",
            "label": "보상 수령",
            "type": "reward"
          }
        ]
      },
      {
        "id": "creator-pureprime-shirt",
        "title": "티셔츠",
        "detail": "PurePrime · 전리품 상자",
        "checks": [
          {
            "id": "creator-pureprime-shirt",
            "label": "보상 수령",
            "type": "reward"
          }
        ]
      },
      {
        "id": "creator-pureprime-hoodie",
        "title": "후드티",
        "detail": "PurePrime · 전리품 상자",
        "checks": [
          {
            "id": "creator-pureprime-hoodie",
            "label": "보상 수령",
            "type": "reward"
          }
        ]
      }
    ]
  },
  {
    "id": "creator-solidfps",
    "category": "drops",
    "title": "SOLIDFPS 크리에이터 협업",
    "description": "프로젝트 보상과 전리품 외형을 각각 기록해요.",
    "entries": [
      {
        "id": "creator-solidfps-backpack",
        "title": "테마 백팩",
        "detail": "SOLIDFPS 프로젝트 6개 완료",
        "checks": [
          {
            "id": "creator-solidfps-backpack",
            "label": "보상 수령",
            "type": "reward"
          }
        ]
      },
      {
        "id": "creator-solidfps-cap",
        "title": "모자",
        "detail": "SOLIDFPS · 전리품 상자",
        "checks": [
          {
            "id": "creator-solidfps-cap",
            "label": "보상 수령",
            "type": "reward"
          }
        ]
      },
      {
        "id": "creator-solidfps-shirt",
        "title": "티셔츠",
        "detail": "SOLIDFPS · 전리품 상자",
        "checks": [
          {
            "id": "creator-solidfps-shirt",
            "label": "보상 수령",
            "type": "reward"
          }
        ]
      },
      {
        "id": "creator-solidfps-hoodie",
        "title": "후드티",
        "detail": "SOLIDFPS · 전리품 상자",
        "checks": [
          {
            "id": "creator-solidfps-hoodie",
            "label": "보상 수령",
            "type": "reward"
          }
        ]
      }
    ]
  },
  {
    "id": "creator-widdz",
    "category": "drops",
    "title": "Widdz 크리에이터 협업",
    "description": "프로젝트 보상과 전리품 외형을 각각 기록해요.",
    "entries": [
      {
        "id": "creator-widdz-backpack",
        "title": "테마 백팩",
        "detail": "Widdz 프로젝트 6개 완료",
        "checks": [
          {
            "id": "creator-widdz-backpack",
            "label": "보상 수령",
            "type": "reward"
          }
        ]
      },
      {
        "id": "creator-widdz-cap",
        "title": "모자",
        "detail": "Widdz · 전리품 상자",
        "checks": [
          {
            "id": "creator-widdz-cap",
            "label": "보상 수령",
            "type": "reward"
          }
        ]
      },
      {
        "id": "creator-widdz-shirt",
        "title": "티셔츠",
        "detail": "Widdz · 전리품 상자",
        "checks": [
          {
            "id": "creator-widdz-shirt",
            "label": "보상 수령",
            "type": "reward"
          }
        ]
      },
      {
        "id": "creator-widdz-hoodie",
        "title": "후드티",
        "detail": "Widdz · 전리품 상자",
        "checks": [
          {
            "id": "creator-widdz-hoodie",
            "label": "보상 수령",
            "type": "reward"
          }
        ]
      }
    ]
  },
  {
    "id": "owned",
    "category": "owned",
    "title": "주요 장비 보유",
    "description": "이번 이벤트의 현상수배·광신도 보스 처치, 열쇠 기부, 이벤트 장비 상자·제단에서 획득할 수 있는 주요 장비예요. 항목마다 획득 경로와 조건이 달라요.",
    "entries": [
      {
        "id": "own-eagle",
        "title": "독수리를 거느린 자",
        "detail": "맹목 현상수배 · 불타는 눈 처치 · 무기 보상 확률 20%",
        "checks": [
          {
            "id": "own-eagle",
            "label": "장비 보유",
            "type": "owned"
          }
        ]
      },
      {
        "id": "own-regulus",
        "title": "레굴루스",
        "detail": "마지막 생존자 현상수배 · 카버 처치 · 무기 보상 확률 20%",
        "checks": [
          {
            "id": "own-regulus",
            "label": "장비 보유",
            "type": "owned"
          }
        ]
      },
      {
        "id": "own-steel",
        "title": "스틸 앤 선즈 ACR",
        "detail": "결박의 원 현상수배 · 결박된 자 처치 · 무기 보상 확률 20%",
        "checks": [
          {
            "id": "own-steel",
            "label": "장비 보유",
            "type": "owned"
          }
        ]
      },
      {
        "id": "own-vindicator",
        "title": "빈디케이터",
        "detail": "러버 앤 글루 현상수배 · 조롱꾼 처치 · 무기 보상 확률 20%",
        "checks": [
          {
            "id": "own-vindicator",
            "label": "장비 보유",
            "type": "owned"
          }
        ]
      },
      {
        "id": "own-prima",
        "title": "프리마돈나",
        "detail": "허수아비 현상수배 · 역병 의사 처치 · 무기 보상 확률 20%",
        "checks": [
          {
            "id": "own-prima",
            "label": "장비 보유",
            "type": "owned"
          }
        ]
      },
      {
        "id": "own-bighorn",
        "title": "빅혼",
        "detail": "암전 현상수배 · 바보의 빛 처치 · 무기 보상 확률 20%",
        "checks": [
          {
            "id": "own-bighorn",
            "label": "장비 보유",
            "type": "owned"
          }
        ]
      },
      {
        "id": "own-ouroboros",
        "title": "우로보로스",
        "detail": "West End (지역 한글명 미확인) · 솔로에서 등장하는 Necromancer Unleashed를 영웅 난이도로 처치 · 무기 보상 확률 20%",
        "checks": [
          {
            "id": "own-ouroboros",
            "label": "장비 보유",
            "type": "owned"
          }
        ]
      },
      {
        "id": "own-sarru",
        "title": "사루",
        "detail": "강령술사 처치 · 무기 보상 확률 20%",
        "checks": [
          {
            "id": "own-sarru",
            "label": "장비 보유",
            "type": "owned"
          }
        ]
      },
      {
        "id": "own-vertigo",
        "title": "버티고",
        "detail": "부활한 헌터 처치 · 무기 보상 확률 20%",
        "checks": [
          {
            "id": "own-vertigo",
            "label": "장비 보유",
            "type": "owned"
          }
        ]
      },
      {
        "id": "own-scorpio",
        "title": "스콜피오",
        "detail": "개인 열쇠 누적 20개 기부 보상",
        "checks": [
          {
            "id": "own-scorpio",
            "label": "장비 보유",
            "type": "owned"
          }
        ]
      },
      {
        "id": "own-caretaker",
        "title": "관리자",
        "detail": "개인 열쇠 누적 100개 기부 보상 · 이벤트 장비 상자·레드 문 제단의 특별 네임드 보상 목록에도 포함",
        "checks": [
          {
            "id": "own-caretaker",
            "label": "장비 보유",
            "type": "owned"
          }
        ],
        "search": "Caretaker"
      },
      {
        "id": "own-lichtenberg",
        "title": "리히텐베르크 · 일반",
        "detail": "이벤트 장비 상자 보상 확률 7% · 레드 문 제단도 같은 장비 보상 목록 사용",
        "checks": [
          {
            "id": "own-lichtenberg",
            "label": "장비 보유",
            "type": "owned"
          }
        ],
        "search": "Lichtenberg"
      },
      {
        "id": "own-lichtenberg-proto",
        "title": "리히텐베르크 · 프로토타입",
        "detail": "이벤트 장비 상자 보상 확률 1% · 레드 문 제단도 같은 장비 보상 목록 사용",
        "checks": [
          {
            "id": "own-lichtenberg-proto",
            "label": "장비 보유",
            "type": "owned"
          }
        ],
        "search": "Prototype Lichtenberg"
      }
    ]
  }
];

export const images: Record<string, RewardImage> = {
  "twitch-summon": {
    "src": "/games/the-division-2/red-moon-unleashed-2026/twitch-summon.webp",
    "width": 160,
    "height": 160,
    "title": "소환 팔 휘장",
    "source": "https://www.ubisoft.com/ko-kr/game/the-division/the-division-2/news-updates/VLVLB9xFr5sLxAtZSVM6J/2-twitch"
  },
  "twitch-bind": {
    "src": "/games/the-division-2/red-moon-unleashed-2026/twitch-bind.webp",
    "width": 160,
    "height": 160,
    "title": "속박 팔 휘장",
    "source": "https://www.ubisoft.com/ko-kr/game/the-division/the-division-2/news-updates/VLVLB9xFr5sLxAtZSVM6J/2-twitch"
  },
  "patch-final": {
    "src": "/games/the-division-2/red-moon-unleashed-2026/patch-final.webp",
    "width": 140,
    "height": 140,
    "title": "카버 팔 휘장",
    "evidence": "카버 상세 화면에서 이름과 선택된 도안을 확인했어요."
  },
  "patch-scarecrow": {
    "src": "/games/the-division-2/red-moon-unleashed-2026/patch-scarecrow.webp",
    "width": 149,
    "height": 149,
    "title": "까마귀 팔 휘장",
    "evidence": "까마귀 상세 화면의 도안을 같은 목록의 첫 번째 원본 화면과 대조했어요."
  },
  "patch-rubber": {
    "src": "/games/the-division-2/red-moon-unleashed-2026/patch-rubber.webp",
    "width": 136,
    "height": 136,
    "title": "조롱꾼 팔 휘장",
    "evidence": "조롱꾼 상세 화면에서 이름과 선택된 도안을 확인했어요."
  },
  "patch-dousing": {
    "src": "/games/the-division-2/red-moon-unleashed-2026/patch-dousing.webp",
    "width": 144,
    "height": 144,
    "title": "바보의 빛 팔 휘장",
    "evidence": "바보의 빛 상세 화면에서 이름과 선택된 도안을 확인했어요."
  },
  "patch-binding": {
    "src": "/games/the-division-2/red-moon-unleashed-2026/patch-binding.webp",
    "width": 144,
    "height": 144,
    "title": "결박된 자 팔 휘장",
    "evidence": "결박된 자 상세 화면에서 이름과 선택된 도안을 확인했어요."
  },
  "mask-houndsman": {
    "src": "/games/the-division-2/red-moon-unleashed-2026/mask-houndsman.webp",
    "width": 144,
    "height": 144,
    "title": "핏빛 사냥개 조련사 마스크",
    "kind": "cosmetic",
    "evidence": "마스크 상세 화면에서 한국어 이름과 선택된 외형을 확인했어요."
  },
  "gloves-houndsman": {
    "src": "/games/the-division-2/red-moon-unleashed-2026/gloves-houndsman.webp",
    "width": 136,
    "height": 136,
    "title": "핏빛 사냥개 조련사 장갑",
    "kind": "cosmetic",
    "evidence": "장갑 상세 화면에서 한국어 이름과 선택된 외형을 확인했어요."
  },
  "backpack-houndsman": {
    "src": "/games/the-division-2/red-moon-unleashed-2026/backpack-houndsman.webp",
    "width": 128,
    "height": 128,
    "title": "핏빛 사냥개 조련사 백팩",
    "kind": "cosmetic",
    "evidence": "백팩 상세 화면에서 한국어 이름과 선택된 외형을 확인했어요."
  },
  "patch-all-six": {
    "src": "/games/the-division-2/red-moon-unleashed-2026/patch-all-six.webp",
    "width": 244,
    "height": 244,
    "title": "강령술사 팔 휘장",
    "evidence": "2026-10-25 공훈 보상 팝업에서 도안·공훈 점수 30점을 확인하고, 후속 의류 상세 화면에서 아이템 이름 강령술사 팔 휘장을 확인했어요. Red Moon Distinction은 아이템 이름이 아닌 6종 처치 공훈 이름이에요. 공식 안내의 Necromancer Arm Patch에 해당해요."
  },
  "mask-necro": {
    "src": "/games/the-division-2/red-moon-unleashed-2026/mask-necro.webp",
    "width": 512,
    "height": 512,
    "title": "결박된 강령술사",
    "kind": "cosmetic",
    "evidence": "2026-10-25 마스크 상세 화면에서 한국어 이름 결박된 강령술사와 특급 등급, 착용 중인 외형을 확인했어요. 화면의 착용 미리보기 기준으로 표시해요."
  },
  "mask-risen": {
    "src": "/games/the-division-2/red-moon-unleashed-2026/mask-risen.webp",
    "width": 512,
    "height": 512,
    "title": "결박된 헌터 마스크",
    "kind": "cosmetic",
    "evidence": "2026-10-25 마스크 상세 화면에서 한국어 이름 결박된 헌터 마스크와 특급 등급, 착용 중인 외형을 확인했어요. 화면의 착용 미리보기 기준으로 표시해요."
  },
  "vfx-hive": {
    "src": "/games/the-division-2/red-moon-unleashed-2026/vfx-hive.webp",
    "width": 140,
    "height": 144,
    "title": "강령술사 하이브",
    "kind": "vfx",
    "evidence": "2026-10-25 한국어판 스킬 스킨 장착 화면에서 이름 강령술사 하이브와 실제 아이콘, 모든 하이브 변형에 사용할 수 있다는 설명을 확인했어요. 시각효과의 아이콘이며 동작 영상은 아니에요."
  },
  "vfx-drone": {
    "src": "/games/the-division-2/red-moon-unleashed-2026/vfx-drone.webp",
    "width": 138,
    "height": 143,
    "title": "박쥐",
    "kind": "vfx",
    "evidence": "2026-10-25 한국어판 스킬 스킨 장착 화면에서 이름 박쥐와 실제 아이콘, 모든 드론 변형에 사용할 수 있다는 설명을 확인했어요. 시각효과의 아이콘이며 동작 영상은 아니에요."
  },
  "patch-blinding": {
    "src": "/games/the-division-2/red-moon-unleashed-2026/patch-blinding.webp",
    "width": 144,
    "height": 146,
    "title": "불타는 눈 팔 휘장",
    "evidence": "2026-10-25 한국어판 의류 상세 화면에서 이름 불타는 눈 팔 휘장과 고급 등급, 선택된 도안을 확인했어요."
  },
  "community-mask": {
    "src": "/games/the-division-2/red-moon-unleashed-2026/community-mask.webp",
    "width": 134,
    "height": 138,
    "title": "바보의 등불 마스크",
    "kind": "cosmetic",
    "evidence": "2026-10-29 한국어판 게임 상세 화면에서 이름과 선택된 보상 외형을 확인했어요."
  },
  "community-jacket": {
    "src": "/games/the-division-2/red-moon-unleashed-2026/community-jacket.webp",
    "width": 144,
    "height": 144,
    "title": "바보의 빛 재킷",
    "kind": "cosmetic",
    "evidence": "2026-10-29 한국어판 게임 상세 화면에서 이름과 선택된 보상 외형을 확인했어요."
  },
  "community-pants": {
    "src": "/games/the-division-2/red-moon-unleashed-2026/community-pants.webp",
    "width": 148,
    "height": 148,
    "title": "바보의 빛 바지",
    "kind": "cosmetic",
    "evidence": "2026-10-29 한국어판 게임 상세 화면에서 이름과 선택된 보상 외형을 확인했어요."
  },
  "twitch-eye": {
    "src": "/games/the-division-2/red-moon-unleashed-2026/twitch-eye.webp",
    "width": 136,
    "height": 130,
    "title": "눈 맞춤 무기 스킨",
    "kind": "cosmetic",
    "evidence": "2026-10-29 한국어판 게임 상세 화면에서 이름과 선택된 보상 외형을 확인했어요."
  },
  "login-mask": {
    "src": "/games/the-division-2/red-moon-unleashed-2026/login-mask.webp",
    "width": 118,
    "height": 143,
    "title": "결박된 슬래셔 마스크",
    "kind": "cosmetic",
    "evidence": "2026-10-29 한국어판 의류 상세 화면에서 이름과 선택된 마스크 외형을 확인했어요.",
    "source": "https://www.ubisoft.com/en-us/game/the-division/the-division-2/news-updates/7uzKuy4iB0MtOJfsXAr3TO/tuy8s32-red-moon-unleashed-creator-collaboration-escalation-updates-more"
  },
  "apparel-trophy": {
    "src": "/games/the-division-2/red-moon-unleashed-2026/apparel-trophy.webp",
    "width": 144,
    "height": 144,
    "title": "강령술사 백팩 트로피 장식",
    "kind": "cosmetic",
    "evidence": "2026-10-29 한국어판 의류 상세 화면에서 이름 강령술사와 분류 백팩 트로피 장식, 선택된 외형을 확인했어요."
  },
  "uniform-houndsman": {
    "src": "/games/the-division-2/red-moon-unleashed-2026/uniform-houndsman.webp",
    "width": 165,
    "height": 288,
    "title": "핏빛 사냥개 조련사 유니폼",
    "kind": "cosmetic",
    "evidence": "2026-10-29 제공된 한국어판 의류 화면에서 이름 핏빛 사냥개 조련사 유니폼과 선택된 의상 외형을 확인했어요. 이미지와 이름 확인은 보상 지급 확인과 별개이며 수령 체크를 자동으로 변경하지 않아요."
  }
};

export const records = groups.flatMap(group =>
  group.entries.flatMap(entry => entry.checks.map(check => ({ ...check, category: group.category, groupId: group.id })))
);
