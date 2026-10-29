"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getLanguage } from "@/lib/i18n";
import styles from "./back-to-top.module.css";

export function BackToTop() {
  const pathname = usePathname();
  const english = getLanguage(pathname) === "en";
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame: number | null = null;
    function update() {
      frame = null;
      const scroller = document.scrollingElement ?? document.documentElement;
      setVisible(scroller.scrollHeight > window.innerHeight && window.scrollY > 0);
    }
    function schedule() {
      if (frame === null) frame = window.requestAnimationFrame(update);
    }
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(schedule);
    observer?.observe(document.body);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      observer?.disconnect();
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, [pathname]);

  function goToTop() {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Move focus before the floating button hides at the top of the page.
    document.querySelector<HTMLAnchorElement>(".wordmark")?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, left: 0, behavior: reducedMotion ? "auto" : "smooth" });
  }

  return <button
    className={styles.button}
    type="button"
    hidden={!visible}
    onClick={goToTop}
    lang={english ? "en" : "ko"}
    aria-label={english ? "Back to top" : "페이지 맨 위로 이동"}
    title={english ? "Back to top" : "페이지 맨 위로 이동"}
  >
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="M12 20V4m-6 6 6-6 6 6" /></svg>
    <span>{english ? "Top" : "맨 위로"}</span>
  </button>;
}
