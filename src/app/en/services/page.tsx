import { ServicesPage } from "@/features/site/services-page";
import { sitePageCopy } from "@/features/site/copy";
import { pageMetadata } from "@/lib/site";

const text = sitePageCopy.en.services;
export const metadata = pageMetadata(text.title, text.description, "/en/services");

export default function Services() {
  return <ServicesPage language="en" />;
}
