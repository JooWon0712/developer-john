import { CentralParkPage, centralParkMetadata } from "@/features/division2/central-park/event-page";

export const metadata = centralParkMetadata("en");
export default function CentralParkEnglishPage() {
  return <CentralParkPage language="en" />;
}
