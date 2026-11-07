import { CentralParkPage, centralParkMetadata } from "@/features/division2/central-park/event-page";

export const metadata = centralParkMetadata("ko");
export default function CentralParkKoreanPage() {
  return <CentralParkPage language="ko" />;
}
