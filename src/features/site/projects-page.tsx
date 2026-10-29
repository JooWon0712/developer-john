import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { getLocalizedProjects } from "@/data/catalog";
import { localizePath, type Language } from "@/lib/i18n";
import { sitePageCopy } from "./copy";

export function ProjectsPage({ language }: { language: Language }) {
  const text = sitePageCopy[language].projects;
  const projects = getLocalizedProjects(language);
  return (
    <>
      <section className="page-intro" lang={language}>
        <p className="eyebrow">PROJECTS / 01</p>
        <h1>{text.heading[0]}<br />{text.heading[1]}</h1>
        <p className="lead">{text.lead[0]}<br />{text.lead[1]}</p>
      </section>
      <section className="section project-list" aria-label={text.listLabel} lang={language}>
        {projects.map((project, index) => (
          <article className="project-row" id={project.id} key={project.id}>
            <span className="project-number" aria-hidden="true">0{index + 1}</span>
            <div className="project-info">
              <span className="badge">{project.status}</span>
              <h2>{project.title}</h2>
              <p>{project.description}</p>
              <div className="project-tags" aria-label={text.technologies}>
                {project.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}
              </div>
              <div className="prose">
                {text.sections.map(section => (
                  <div key={section.title}>
                    <h3>{section.title}</h3>
                    <p>{section.body}</p>
                  </div>
                ))}
              </div>
              <Link className="text-link" href={localizePath("/services", language)}>
                {text.browseServices} <ArrowRight width={18} height={18} aria-hidden="true" focusable="false" />
              </Link>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
