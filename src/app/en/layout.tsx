import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: { default: `${site.name} — Small ideas, made real`, template: `%s | ${site.name}` },
  description: "Turning ideas from everyday life into small web services to share.",
};

export default function EnglishLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div lang="en">{children}</div>;
}
