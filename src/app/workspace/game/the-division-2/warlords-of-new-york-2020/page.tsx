import { RewardGuidePage, rewardGuideMetadata } from "@/features/division2/reward-guide-page";

export const metadata = rewardGuideMetadata("warlords-of-new-york-2020", "ko");

export default function Page() {
  return <RewardGuidePage guideId="warlords-of-new-york-2020" language="ko" />;
}
