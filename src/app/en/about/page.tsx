import { AboutPage } from "@/features/site/about-page";
import { aboutCopy } from "@/features/site/about-copy";
import { pageMetadata } from "@/lib/site";

const text = aboutCopy.en;
export const metadata = pageMetadata(text.title, text.description, "/en/about");

export default function About() {
  return <AboutPage language="en" />;
}
