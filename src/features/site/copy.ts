import { brand } from "@/data/brand";

export const sitePageCopy = {
  ko: {
    home: {
      title: "홈",
      headline: ["개발자 John의", "작은 작업실."],
      introduction: "일상에서 떠오른 아이디어와 개인 작업을 한곳에 모았습니다.",
      sceneAlt: "작은 항구가 보이는 카페에서 안경을 쓴 회색 아기 웜뱃이 노트북으로 작업하는 픽셀 그림",
      browseServices: "서비스 둘러보기",
      about: "John 소개",
    },
    services: {
      title: "서비스",
      description: "개인적으로 쓰던 도구와 떠올린 아이디어를 서비스로 공유합니다.",
      heading: "일상에서 건져 올린 아이디어.",
      lead: "개인적으로 쓰던 도구와 떠올린 아이디어를 서비스로 공유합니다.",
    },
    projects: {
      title: "프로젝트",
      description: brand.name + "의 프로젝트와 구현 방향을 소개합니다.",
      heading: ["아이디어가", "형태를 갖추는 곳."],
      lead: ["무엇을, 왜, 어떻게 만드는지.", "프로젝트에 담긴 생각과 과정을 소개합니다."],
      listLabel: "프로젝트 목록",
      technologies: "프로젝트 기술",
      browseServices: "서비스 둘러보기",
      sections: [
        { title: "한곳에 모으는 작은 실험들", body: "소개와 프로젝트 기록을 읽고, 직접 만든 서비스를 바로 사용해볼 수 있는 개인 사이트를 만들고 있습니다. 첫 단계는 이 공간의 기반을 갖추는 일입니다." },
        { title: "가볍게 시작하고, 필요한 만큼 확장하기", body: "Next.js와 TypeScript를 사용합니다. 소개와 프로젝트 설명은 미리 생성하고, 서비스 목록에서는 디비전2 이벤트와 보상 정보를 제공합니다. Synology NAS에서 Docker로 운영할 수 있도록 준비하고 있습니다." },
        { title: "다음 단계", body: "디비전2 레드 문 보상 가이드와 개인 체크리스트를 첫 서비스로 추가했습니다. 서비스 목록에서 디비전2의 이벤트별 가이드를 선택해 이용할 수 있습니다." },
      ],
    },
  },
  en: {
    home: {
      title: "Home",
      headline: ["Developer John’s", "little workspace."],
      introduction: "A place for ideas from everyday life and my personal projects.",
      sceneAlt: "Pixel art of a grey baby wombat wearing glasses and working on a laptop at a café overlooking a small harbor",
      browseServices: "Explore services",
      about: "About John",
    },
    services: {
      title: "Services",
      description: "I share personal tools and ideas as web services.",
      heading: "Ideas from everyday life.",
      lead: "I share personal tools and ideas as web services.",
    },
    projects: {
      title: "Projects",
      description: "Explore the projects and development approach behind " + brand.name + ".",
      heading: ["Where ideas", "take shape."],
      lead: ["What I build, why I build it, and how.", "Explore the thinking and work behind each project."],
      listLabel: "Projects",
      technologies: "Project technologies",
      browseServices: "Explore services",
      sections: [
        { title: "Small experiments in one place", body: "I am building a personal site where you can learn about me, follow my projects and try the services I make. The first step is creating a foundation for this space." },
        { title: "Start small and grow as needed", body: "The site uses Next.js and TypeScript. About and project pages are generated in advance, while the service directory provides The Division 2 event and reward information. It is being prepared to run with Docker on a Synology NAS." },
        { title: "What comes next", body: "The first service is a Red Moon Unleashed reward guide and personal checklist for The Division 2. Open The Division 2 from the service directory to choose an event guide." },
      ],
    },
  },
} as const;
