import { RedMoonEventPage, redMoonMetadata } from "@/features/division2/red-moon/event-page";

export const metadata = redMoonMetadata("en");
export default function RedMoonEnglishPage() {
  return <RedMoonEventPage language="en" />;
}
