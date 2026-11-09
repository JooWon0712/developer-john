import { RewardGuidePage, rewardGuideMetadata } from "@/features/division2/reward-guide-page";

export const metadata = rewardGuideMetadata("base-game-2019", "ko");

export default function Page() {
  return <RewardGuidePage guideId="base-game-2019" language="ko" />;
}
