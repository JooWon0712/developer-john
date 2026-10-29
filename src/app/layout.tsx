import type { Metadata } from "next";
import { SiteHeader, SiteSkipLink } from "@/components/site-header";
import { BackToTop } from "@/components/back-to-top";
import { SiteFooter } from "@/components/site-footer";
import { SiteContent } from "@/components/site-content";
import { GoogleAnalytics } from "@/components/google-analytics";
import { site, siteUrl } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: `${site.name} — 작은 아이디어를 만드는 곳`, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.name,
  metadataBase: siteUrl,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko" data-scroll-behavior="smooth"><body>
    <SiteSkipLink />
    <SiteHeader />
    <SiteContent>{children}</SiteContent>
    <SiteFooter />
    <BackToTop />
    <GoogleAnalytics />
  </body></html>;
}
