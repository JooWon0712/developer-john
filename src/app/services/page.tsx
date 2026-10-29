import { ServicesPage } from "@/features/site/services-page";
import { sitePageCopy } from "@/features/site/copy";
import { pageMetadata } from "@/lib/site";

const text = sitePageCopy.ko.services;
export const metadata = pageMetadata(text.title, text.description, "/services");

export default function Services() {
  return <ServicesPage language="ko" />;
}
