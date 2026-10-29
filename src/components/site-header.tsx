"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { brand } from "@/data/brand";
import { shell } from "@/data/shell";
import { getBasePath, getLanguage, localizePath } from "@/lib/i18n";
import { LanguageSwitch } from "./language-switch";

const navigation = [
  { href: "/", label: "홈", englishLabel: "Home", directory: shell.home },
  { href: "/services", label: "서비스", englishLabel: "Services", directory: shell.services },
];

export function SiteHeader() {
  const pathname = usePathname();
  const language = getLanguage(pathname);
  const basePath = getBasePath(pathname);
  const english = language === "en";
  const homeLabel = `${shell.user} ${english ? "Home" : "홈"}`;

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return <header className="site-header" lang={language}>
    <div className="header-inner container">
      <Link className="wordmark" href={localizePath("/", language)} aria-label={homeLabel} title={homeLabel}>
        <Image className="brand-mark" src={brand.mark} alt="" width={40} height={40} unoptimized />
        <span>{shell.user}</span>
      </Link>
      <div className="header-navigation">
        <nav className="main-navigation" aria-label={english ? "Main navigation" : "주 메뉴"}>
          {navigation.map(({ href, label, englishLabel, directory }) => {
            const active = basePath === href ? "page" : href === "/services" && (basePath.startsWith("/services/") || basePath.startsWith("/discovery/")) ? "location" : undefined;
            const navigationLabel = english ? englishLabel : label;
            return <Link key={href} href={localizePath(href, language)} aria-label={`${directory} (${navigationLabel})`} title={`${shell.user} ${navigationLabel}`} aria-current={active}><span aria-hidden="true">{directory}</span><span className="nav-cursor" aria-hidden="true">{active ? "_" : ""}</span></Link>;
          })}
        </nav>
        <LanguageSwitch />
      </div>
    </div>
  </header>;
}

export function SiteSkipLink() {
  const language = getLanguage(usePathname());
  return <a className="skip-link" href="#main-content" lang={language}>{language === "en" ? "Skip to content" : "본문으로 바로가기"}</a>;
}
