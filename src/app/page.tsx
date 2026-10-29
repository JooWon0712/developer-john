import { HomePage } from "@/features/site/home-page";
import { sitePageCopy } from "@/features/site/copy";
import { pageMetadata, site } from "@/lib/site";

const text = sitePageCopy.ko.home;
export const metadata = {
  ...pageMetadata(text.title, text.introduction, "/"),
  title: { absolute: site.name },
};

export default function Home() {
  return <HomePage language="ko" />;
}
