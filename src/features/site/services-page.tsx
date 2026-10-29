import { ServiceDirectory } from "@/components/service-directory";
import { TerminalWindow } from "@/components/terminal-window";
import { services } from "@/data/catalog";
import { shell } from "@/data/shell";
import { localizePath, type Language } from "@/lib/i18n";
import { sitePageCopy } from "./copy";

export function ServicesPage({ language }: { language: Language }) {
  const text = sitePageCopy[language].services;
  return (
    <>
      <section className="page-intro services-intro" lang={language}>
        <h1>{text.heading[0]}<br />{text.heading[1]}</h1>
      </section>
      <section className="directory-panel" aria-labelledby="directory-title" lang={language}>
        <h2 id="directory-title" className="visually-hidden">{text.title}</h2>
        <TerminalWindow title={shell.services} bodyClassName="directory-session" parentLink={{ href: localizePath("/", language), label: language === "en" ? "Home" : "홈", command: "cd .." }}>
          <ServiceDirectory services={services} language={language} />
        </TerminalWindow>
      </section>
    </>
  );
}
