import { ProjectsPage } from "@/features/site/projects-page";
import { sitePageCopy } from "@/features/site/copy";
import { pageMetadata } from "@/lib/site";

const text = sitePageCopy.ko.projects;
export const metadata = pageMetadata(text.title, text.description, "/projects");

export default function Projects() {
  return <ProjectsPage language="ko" />;
}
