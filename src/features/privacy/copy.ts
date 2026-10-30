import type { Language } from "@/lib/i18n";

export const privacyWrittenDate = "2026-10-30";

type PolicySection = {
  id: string;
  title: string;
  paragraphs: string[];
  details?: { label: string; value: string }[];
  links?: { label: string; href: string }[];
};

type PrivacyCopy = {
  title: string;
  description: string;
  dateLabel: string;
  introduction: string;
  contents: string;
  home: string;
  contact: string;
  contactText: string;
  sections: PolicySection[];
};

export const privacyCopy = {
  ko: {
    title: "개인정보처리방침",
    description: "developer-john의 보상 기록 저장, 방문 통계와 이메일 문의의 정보 처리 방식을 안내합니다.",
    dateLabel: "작성일",
    introduction: "사이트에는 회원가입이나 별도의 문의 양식이 없습니다. 보상 기록의 브라우저 저장, 방문 통계와 이메일 문의에 관한 처리 방식을 안내합니다.",
    contents: "목차",
    home: "홈",
    contact: "개인정보 관련 문의",
    contactText: "사이트 운영자가 개인정보 관련 문의와 요청에 직접 답변합니다.",
    sections: [
      {
        id: "local-records",
        title: "보상 기록의 브라우저 저장",
        paragraphs: [
          "보상 기록은 이용자의 브라우저 저장소(localStorage)에 저장됩니다. 사이트 서버나 Google Analytics로 전송하지 않습니다.",
        ],
        details: [
          { label: "저장 항목", value: "체크한 보상 항목, 의류 수집 수량, 저장 시각과 이벤트 구분 정보" },
          { label: "이용 목적", value: "체크 상태 복원과 수집 진행률 표시" },
          { label: "보관·삭제", value: "자동 만료기간은 없습니다. 브라우저 설정에서 이 사이트의 데이터를 삭제하면 제거됩니다. 가이드의 ‘기록 초기화’는 진행 상태를 빈 기록으로 덮어씁니다." },
        ],
      },
      {
        id: "analytics",
        title: "Google Analytics 방문 통계",
        paragraphs: [
          "사이트 이용 현황과 콘텐츠 개선을 위해 Google Analytics 4를 사용하도록 설정했습니다. 작동 시 방문 페이지, 유입 경로, 브라우저·기기 종류 등의 이용 정보가 Google에 전달될 수 있으며 쿠키가 사용될 수 있습니다.",
          "방문 통계는 공개 사이트의 운영 버전에서만 작동하며, 로컬 개발 환경에서는 수집하지 않습니다.",
          "세부 위치·기기 데이터 수집과 광고 개인 최적화는 꺼두었습니다. 국가 등 기본 방문 통계는 수집될 수 있습니다.",
          "이벤트·사용자 데이터 보관기간은 각각 14개월이며, 새 활동이 발생해도 사용자 데이터 보관기간을 재설정하지 않습니다. 이 설정은 표준 집계 보고서 전체의 보관기간이나 쿠키 유효기간을 뜻하지 않습니다.",
        ],
        links: [
          { label: "Google의 파트너 사이트 정보 처리 안내", href: "https://policies.google.com/technologies/partner-sites?hl=ko" },
          { label: "Google 개인정보처리방침", href: "https://policies.google.com/privacy?hl=ko" },
          { label: "Google Analytics 데이터 보관 기준", href: "https://support.google.com/analytics/answer/7667196?hl=ko" },
        ],
      },
      {
        id: "email",
        title: "이메일 문의",
        paragraphs: [
          "공개 문의 주소로 보내주신 메일은 Gmail에서 확인하고 답변합니다. 문의에 필요한 내용만 보내주세요.",
        ],
        details: [
          { label: "처리 항목", value: "발신 이메일 주소와 이용자가 직접 보낸 이름·문의 내용·첨부파일 등" },
          { label: "이용 목적", value: "문의 확인, 답변 및 후속 문의 대응" },
          { label: "보관기간", value: "마지막 응대 완료일부터 1년입니다. 같은 문의에 대한 후속 응대가 있으면 마지막 후속 응대 완료일부터 계산합니다." },
          { label: "삭제 방법", value: "기간이 지난 문의 메일은 Gmail 휴지통에서도 영구 삭제합니다. 첨부파일을 별도로 저장한 경우 해당 파일도 삭제합니다." },
          { label: "보호 조치", value: "메일함은 운영자 본인만 접근하며, 관리하는 Google 계정에 2단계 인증을 사용합니다." },
        ],
      },
      {
        id: "choices",
        title: "이용자의 선택과 요청",
        paragraphs: [
          "보상 기록과 쿠키는 브라우저 설정에서 관리할 수 있습니다. 브라우저에만 저장된 보상 기록은 운영자가 직접 조회하거나 삭제할 수 없습니다.",
          "Google Analytics 수집을 제한하려면 지원되는 브라우저에서 아래의 분석 차단 부가 기능을 이용할 수 있습니다. 브라우저 데이터 삭제만으로 이미 Google에 전달된 정보가 삭제되지는 않습니다.",
          "문의 메일 등에 포함된 정보의 열람·정정·삭제·처리정지는 아래 이메일로 요청해주세요. 본인 또는 정당한 대리인인지 필요한 범위에서 확인한 뒤 관련 법령에 따라 처리하고, 결과나 제한 사유·이의제기 방법을 이메일로 안내합니다.",
        ],
        links: [
          { label: "Google Analytics 차단 부가 기능", href: "https://tools.google.com/dlpage/gaoptout?hl=ko" },
        ],
      },
      {
        id: "updates",
        title: "내용 변경",
        paragraphs: [
          "정보 처리 방식이 바뀌면 이 페이지에 변경 내용을 반영합니다.",
        ],
      },
    ],
  },
  en: {
    title: "Privacy Policy",
    description: "How developer-john handles browser reward records, visit analytics and email enquiries.",
    dateLabel: "Written",
    introduction: "The site has no account registration or separate enquiry form. This page explains browser-based reward records, visit analytics and email enquiries.",
    contents: "Contents",
    home: "Home",
    contact: "Privacy enquiries",
    contactText: "The site operator handles privacy enquiries and requests directly.",
    sections: [
      {
        id: "local-records",
        title: "Reward records in your browser",
        paragraphs: [
          "Reward records are stored in your browser’s local storage (localStorage). They are not sent to the site server or Google Analytics.",
        ],
        details: [
          { label: "Stored information", value: "Checked reward items, apparel collection count, save time and information identifying the event" },
          { label: "Purpose", value: "Restoring your checklist and displaying collection progress" },
          { label: "Retention and deletion", value: "No automatic expiry is set. Clearing this site’s data in your browser removes the records. The guide’s ‘Reset progress’ action overwrites progress with an empty record." },
        ],
      },
      {
        id: "analytics",
        title: "Google Analytics visit statistics",
        paragraphs: [
          "Google Analytics 4 is configured to understand site usage and improve content. When it runs, usage information such as visited pages, referral sources and browser or device types may be sent to Google, and cookies may be used.",
          "Visit analytics runs only on the production version of the public site. It does not run in local development.",
          "Granular location and device data collection and ads personalisation are disabled. Basic visit statistics, including country-level location, may still be collected.",
          "Event and user data retention are each set to 14 months. New activity does not reset the user data retention period. These settings do not define the overall retention period for standard aggregated reports or the lifetime of browser cookies.",
        ],
        links: [
          { label: "How Google uses information from partner sites", href: "https://policies.google.com/technologies/partner-sites?hl=en" },
          { label: "Google Privacy Policy", href: "https://policies.google.com/privacy?hl=en" },
          { label: "Google Analytics data retention rules", href: "https://support.google.com/analytics/answer/7667196?hl=en" },
        ],
      },
      {
        id: "email",
        title: "Email enquiries",
        paragraphs: [
          "Emails sent to the public contact address are read and answered in Gmail. Please send only the information needed for your enquiry.",
        ],
        details: [
          { label: "Information handled", value: "Your sender email address and information you choose to send, such as a name, message or attachments" },
          { label: "Purpose", value: "Reviewing and replying to your enquiry, and handling follow-up questions" },
          { label: "Retention period", value: "One year from completion of the last response. Further correspondence about the same enquiry starts the period from completion of the last follow-up response." },
          { label: "Deletion", value: "Expired enquiry emails are permanently deleted from Gmail Trash as well. Any attachments saved separately are also deleted." },
          { label: "Security", value: "Only the site operator has access to the mailbox. Two-step verification is enabled for the Google account that manages it." },
        ],
      },
      {
        id: "choices",
        title: "Your choices and requests",
        paragraphs: [
          "You can manage reward records and cookies in your browser settings. The operator cannot directly view or delete reward records stored only in your browser.",
          "To limit Google Analytics collection, use the opt-out add-on below in a supported browser. Clearing browser data alone does not delete information already sent to Google.",
          "Use the email below to request access to, correction or deletion of, or restriction of processing of information such as enquiry emails. After verifying your identity or authority as a representative to the extent needed, the operator handles the request under applicable law and replies with the outcome or the reasons for any restriction and how to challenge it.",
        ],
        links: [
          { label: "Google Analytics opt-out browser add-on", href: "https://tools.google.com/dlpage/gaoptout?hl=en" },
        ],
      },
      {
        id: "updates",
        title: "Updates",
        paragraphs: [
          "Changes to how information is handled will be reflected on this page.",
        ],
      },
    ],
  },
} satisfies Record<Language, PrivacyCopy>;
