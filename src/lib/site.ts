import type { Metadata } from "next";
import { brand } from "@/data/brand";
import { getLanguage, localizePath } from "./i18n";

export const site = brand;

function getSiteUrl(): URL {
  const value = process.env.NEXT_PUBLIC_SITE_URL?.trim() || site.defaultUrl;

  const url = new URL(value);
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.pathname !== '/' || url.search || url.hash) {
    throw new Error("NEXT_PUBLIC_SITE_URL에는 경로나 인증 정보가 없는 http(s) origin을 입력하세요.");
  }
  return url;
}

export const siteUrl = getSiteUrl();

export const socialPreviewImage = {
  url: new URL("/brand/social-preview-v1.png", siteUrl).href,
  width: 1730,
  height: 909,
  alt: site.name,
} as const;

export function pageMetadata(title: string, description: string, path: string): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: new URL(path, siteUrl).href,
      languages: {
        ko: new URL(localizePath(path, "ko"), siteUrl).href,
        en: new URL(localizePath(path, "en"), siteUrl).href,
        "x-default": new URL(localizePath(path, "ko"), siteUrl).href,
      },
    },
    openGraph: { title: `${title} | ${site.name}`, description, url: new URL(path, siteUrl).href, siteName: site.name, locale: getLanguage(path) === "en" ? "en_US" : "ko_KR", type: "website", images: [socialPreviewImage] },
    twitter: { card: "summary_large_image", title: `${title} | ${site.name}`, description, images: [socialPreviewImage] },
  };
}
