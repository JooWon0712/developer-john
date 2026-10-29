import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { localizePath, type Language } from "@/lib/i18n";

export function NotFoundPage({ language = "ko" }: { language?: Language }) {
  const english = language === "en";
  return <div className="not-found" lang={language}>
    <p className="eyebrow">404 / PAGE NOT FOUND</p>
    <h1>{english ? "This page could not be found." : "이 페이지는 찾을 수 없어요."}</h1>
    <p className="lead">{english ? "Check the address or explore another part of the site." : "주소를 확인하거나, 작업실의 다른 공간을 둘러보세요."}</p>
    <Link className="button" href={localizePath("/", language)}>{english ? "Back to home" : "홈으로 돌아가기"}<ArrowRight /></Link>
  </div>;
}
