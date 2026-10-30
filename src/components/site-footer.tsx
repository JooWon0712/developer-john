"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getLanguage, localizePath } from "@/lib/i18n";
import { brand } from "@/data/brand";
import { contact } from "@/data/contact";

export function SiteFooter() {
  const pathname = usePathname();
  const language = getLanguage(pathname);
  const english = language === "en";
  return <footer className="site-footer" lang={english ? "en" : "ko"}>
    <div className="container footer-inner">
      <div className="footer-info">
        <p className="footer-message">{english ? "Ideas into everyday life." : "아이디어를 일상으로"}</p>
        {(contact.email || contact.githubUrl) && <address className="footer-contact">
          <span className="footer-contact-label" lang="en"><span aria-hidden="true">&gt; </span>contact</span>
          {contact.email && <a href={`mailto:${contact.email}`}>{contact.email}</a>}
          {contact.githubUrl && <a href={contact.githubUrl} target="_blank" rel="noopener noreferrer" title={english ? "GitHub profile" : "GitHub 프로필"}>GitHub</a>}
        </address>}
        <Link className="footer-privacy" href={localizePath("/privacy", language)} aria-current={pathname === localizePath("/privacy", language) ? "page" : undefined}>{english ? "Privacy Policy" : "개인정보처리방침"}</Link>
      </div>
      <p className="copyright" lang="en">© 2026 {brand.name} <span>All rights reserved.</span></p>
    </div>
  </footer>;
}
