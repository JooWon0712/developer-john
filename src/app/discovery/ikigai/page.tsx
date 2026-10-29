import { IkigaiPageContent } from "@/features/discovery/ikigai/page-content";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata(
  "좋아하는 일 찾기",
  "좋아하는 것, 해본 일, 돕고 싶은 문제와 보상 경험을 돌아보고 이번 주에 해볼 활동 세 가지를 찾아보세요. 답변과 실험 후기는 내 브라우저에 저장합니다.",
  "/discovery/ikigai",
);

export default function IkigaiPage() {
  return <IkigaiPageContent />;
}
