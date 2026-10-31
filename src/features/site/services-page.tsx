import { ServiceDirectory } from "@/components/service-directory";
import { SharePageButton } from "@/components/share-page-button";
import { TerminalWindow } from "@/components/terminal-window";
import { services } from "@/data/catalog";
import { shell } from "@/data/shell";
import { localizePath, type Language } from "@/lib/i18n";
import { siteUrl } from "@/lib/site";
import { sitePageCopy } from "./copy";

export function ServicesPage({ language }: { language: Language }) {
  const text = sitePageCopy[language].services;
  return (
    <>
      <section className="page-intro services-intro" lang={language}>
        <h1>{text.heading}</h1>
        <p className="lead">{text.lead}</p>
        <SharePageButton url={new URL(localizePath(shell.services, language), siteUrl).href} language={language} />
      </section>
      <section className="directory-panel" aria-labelledby="directory-title" lang={language}>
        <h2 id="directory-title" className="visually-hidden">{text.title}</h2>
        <TerminalWindow title={localizePath(shell.services, language)} bodyClassName="directory-session" parentLink={{ href: localizePath("/", language), label: language === "en" ? "Home" : "홈" }}>
          <ServiceDirectory services={services} language={language} />
        </TerminalWindow>
      </section>
    </>
  );
}
