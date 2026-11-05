import { brand } from "@/data/brand";
import { desktopTools } from "@/features/desktop-tools/tools";
import type { Language } from "@/lib/i18n";

export type ServiceCategoryId = "game" | "discovery" | "tools";

export type ServiceCategory = {
  id: ServiceCategoryId;
  title: string;
  description: string;
  pathPrefix: string;
};

export const serviceCategories: ServiceCategory[] = [
  {
    id: "game",
    title: "게임",
    description: "게임 이벤트와 받을 수 있는 보상 정보를 한곳에 정리합니다.",
    pathPrefix: "/services/game",
  },
  {
    id: "tools",
    title: "PC 도구",
    description: "직접 겪은 불편함을 해결하려고 만들어 사용하는 Windows 앱입니다.",
    pathPrefix: "/services/tools",
  },
];

type ServiceBase = {
  id: string;
  addedOrder: number;
  directory: string;
  topic: string;
  title: string;
  description: string;
  category: ServiceCategoryId;
  platform?: string;
};

export type Service =
  | (ServiceBase & { status: "ready"; href: string })
  | (ServiceBase & { status: "planned"; href?: never });

// Increase addedOrder for each new addition; keep the same value for services added together.
// Updating an existing service does not change its addedOrder.
const serviceEntries: Service[] = [
  ...desktopTools.map((tool): Service => ({
    id: tool.id,
    addedOrder: tool.addedOrder,
    directory: tool.id,
    topic: tool.copy.ko.name,
    title: tool.copy.ko.tagline,
    description: tool.copy.ko.cardDescription,
    category: "tools",
    platform: "Windows 10 / 11 · x64",
    status: "ready",
    href: tool.path,
  })),
  {
    id: "the-division-2",
    addedOrder: 0,
    directory: "the-division-2",
    topic: "디비전2",
    title: "이벤트·보상 정보",
    description: "디비전2의 이벤트 일정과 보상, 획득 조건을 확인하고 받은 보상을 기록하세요.",
    category: "game",
    status: "ready",
    href: "/services/game/the-division-2",
  },
];

// Stable sorting preserves the requested order within the same addition.
export const services: Service[] = serviceEntries.sort((a, b) => b.addedOrder - a.addedOrder);

export type Project = {
  id: string;
  title: string;
  description: string;
  status: string;
  tags: string[];
};

export const projects: Project[] = [
  {
    id: "johnwest-lab",
    title: brand.name,
    description:
      "개인 소개와 직접 만든 웹서비스를 한곳에 모으는 공간. 작은 아이디어를 하나씩 구현하고, 만드는 과정도 함께 기록합니다.",
    status: "개발 중",
    tags: ["Next.js", "TypeScript", "Docker"],
  },
];

const englishCategories: Record<string, Pick<ServiceCategory, "title" | "description">> = {
  game: { title: "Games", description: "Game events and the rewards you can earn, gathered in one place." },
  tools: { title: "PC tools", description: "Windows apps I built and use to solve problems I ran into myself." },
};
const englishServices: Record<string, Pick<Service, "topic" | "title" | "description">> = {
  "the-division-2": {
    topic: "The Division 2",
    title: "Events & rewards",
    description: "Find The Division 2 event dates, rewards and requirements, then track the rewards you have claimed.",
  },
  ...Object.fromEntries(desktopTools.map(tool => [tool.id, {
    topic: tool.copy.en.name,
    title: tool.copy.en.tagline,
    description: tool.copy.en.cardDescription,
  }])),
};
const englishProjects: Record<string, Pick<Project, "description" | "status">> = {
  "johnwest-lab": {
    description: "A home for my introduction and the small web services I build. I turn ideas into working projects and share the process along the way.",
    status: "In development",
  },
};

export function getLocalizedCategories(language: Language): ServiceCategory[] {
  return serviceCategories.map(category => language === "en" ? { ...category, ...englishCategories[category.id] } : { ...category });
}

export function getLocalizedServices(language: Language, entries: readonly Service[] = services): Service[] {
  return entries.map(service => language === "en" ? { ...service, ...englishServices[service.id] } : { ...service });
}

export function getLocalizedProjects(language: Language): Project[] {
  return projects.map(project => ({
    ...project,
    ...(language === "en" ? englishProjects[project.id] : {}),
    tags: [...project.tags],
  }));
}
