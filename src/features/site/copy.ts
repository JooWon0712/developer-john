import { brand } from "@/data/brand";

export const sitePageCopy = {
  ko: {
    home: {
      title: "소개",
      headline: "호기심을 펼쳐두는 곳.",
      introduction: brand.description,
      directory: {
        label: "사이트 맵",
        services: "서비스",
        privacy: "개인정보처리방침",
        caption: "일상 속 아이디어가 모이는 곳.",
      },
      browseServices: "서비스 둘러보기",
      contactLabel: "john에게 이메일 보내기",
    },
    services: {
      title: "서비스",
      description: brand.name + "의 게임 서비스를 둘러보세요. 디비전2 이벤트 일정과 보상 정보를 확인할 수 있습니다.",
      heading: ["호기심에서 시작한", "작은 서비스들."],
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
      title: "About",
      headline: "A small place for curious ideas.",
      introduction: "I turn ideas from everyday life into small web services to share.",
      directory: {
        label: "Site map",
        services: "Services",
        privacy: "Privacy Policy",
        caption: "A place for everyday ideas.",
      },
      browseServices: "Explore services",
      contactLabel: "Email john",
    },
    services: {
      title: "Services",
      description: "Browse " + brand.name + "'s game services. Find The Division 2 event schedules, rewards and requirements.",
      heading: ["Small services,", "sparked by curiosity."],
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
