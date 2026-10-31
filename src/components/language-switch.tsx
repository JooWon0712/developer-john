"use client";

import Link from "next/link";
import { Fragment, Suspense, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getLanguage, localizePath, type Language } from "@/lib/i18n";

const languages = [
  { language: "ko", label: "한국어" },
  { language: "en", label: "English" },
] as const;

function LanguageLinks({ pathname, language, suffix = "" }: { pathname: string; language: Language; suffix?: string }) {
  const router = useRouter();
  return <nav className="language-switch" aria-label={language === "en" ? "Language" : "언어 선택"}>
    <span className="language-options">
    {languages.map((option, index) => <Fragment key={option.language}>
      {index > 0 && <span className="language-separator" aria-hidden="true">/</span>}
      <Link
      key={option.language}
      href={localizePath(`${pathname}${suffix}`, option.language)}
      lang={option.language}
      hrefLang={option.language}
      aria-current={language === option.language ? "page" : undefined}
      prefetch={false}
      onNavigate={event => {
        // Read the current URL at activation too, so rapid query/hash changes are preserved.
        const current = window.location;
        event.preventDefault();
        router.push(localizePath(`${current.pathname}${current.search}${current.hash}`, option.language));
      }}
    >
      <span>{option.label}</span>
    </Link></Fragment>)}
    </span>
  </nav>;
}

function LiveLanguageSwitch() {
  const pathname = usePathname();
  const query = useSearchParams().toString();
  const [location, setLocation] = useState({ pathname: "", query: "", suffix: "" });

  useEffect(() => {
    function syncLocation() {
      setLocation({
        pathname: window.location.pathname,
        query: new URLSearchParams(window.location.search).toString(),
        suffix: `${window.location.search}${window.location.hash}`,
      });
    }
    syncLocation();
    window.addEventListener("hashchange", syncLocation);
    window.addEventListener("popstate", syncLocation);
    return () => {
      window.removeEventListener("hashchange", syncLocation);
      window.removeEventListener("popstate", syncLocation);
    };
  }, [pathname, query]);

  const suffix = location.pathname === pathname && location.query === query ? location.suffix : query ? `?${query}` : "";
  return <LanguageLinks pathname={pathname} language={getLanguage(pathname)} suffix={suffix} />;
}

export function LanguageSwitch() {
  const pathname = usePathname();
  return <Suspense fallback={<LanguageLinks pathname={pathname} language={getLanguage(pathname)} />}>
    <LiveLanguageSwitch />
  </Suspense>;
}
