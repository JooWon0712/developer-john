import { PrivacyPage } from "@/features/privacy/privacy-page";
import { privacyCopy } from "@/features/privacy/copy";
import { pageMetadata } from "@/lib/site";

const text = privacyCopy.ko;
export const metadata = {
  ...pageMetadata(text.title, text.description, "/privacy"),
  robots: { index: false, follow: true },
};

export default function Privacy() {
  return <PrivacyPage language="ko" />;
}
