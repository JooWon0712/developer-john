import { notFound } from "next/navigation";

export const metadata = { title: "Page not found", robots: { index: false } };

export default function UnknownEnglishPage() {
  notFound();
}
