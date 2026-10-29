"use client";

import { usePathname } from "next/navigation";
import { getLanguage } from "@/lib/i18n";
import { brand } from "@/data/brand";
import { contact } from "@/data/contact";

export function SiteFooter() {
  const english = getLanguage(usePathname()) === "en";
  return <footer className="site-footer" lang={english ? "en" : "ko"}>
    <div className="container footer-inner">
      <div className="footer-info">
        <p className="footer-message">{english ? "Ideas into everyday life." : "아이디어를 일상으로"}</p>
        {(contact.email || contact.githubUrl) && <address className="footer-contact">
          <span className="footer-contact-label" lang="en"><span aria-hidden="true">&gt; </span>contact</span>
          {contact.email && <a href={`mailto:${contact.email}`}>{contact.email}</a>}
          {contact.githubUrl && <a href={contact.githubUrl} target="_blank" rel="noopener noreferrer" title={english ? "GitHub profile" : "GitHub 프로필"}>GitHub</a>}
        </address>}
      </div>
      <p className="copyright">© 2026 {brand.name}</p>
    </div>
  </footer>;
}
