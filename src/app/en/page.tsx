import { HomePage } from "@/features/site/home-page";
import { sitePageCopy } from "@/features/site/copy";
import { pageMetadata, site } from "@/lib/site";

const text = sitePageCopy.en.home;
export const metadata = {
  ...pageMetadata(text.title, text.introduction, "/en"),
  title: { absolute: site.name },
};

export default function Home() {
  return <HomePage language="en" />;
}
