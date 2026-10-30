import { PrivacyPage } from "@/features/privacy/privacy-page";
import { privacyCopy } from "@/features/privacy/copy";
import { pageMetadata } from "@/lib/site";

const text = privacyCopy.en;
export const metadata = {
  ...pageMetadata(text.title, text.description, "/en/privacy"),
  robots: { index: false, follow: true },
};

export default function Privacy() {
  return <PrivacyPage language="en" />;
}
