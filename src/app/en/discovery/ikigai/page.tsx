import { IkigaiPageContent } from "@/features/discovery/ikigai/page-content";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata(
  "Find what you enjoy",
  "Reflect on what you enjoy, what you have tried, problems you want to help with, and reward experiences. Explore three activities to try this week. Answers and reflections stay in your browser.",
  "/en/discovery/ikigai",
);

export default function EnglishIkigaiPage() {
  return <IkigaiPageContent language="en" />;
}
