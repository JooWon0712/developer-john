"use client";

import { useEffect, useRef, useState } from "react";
import type { Language } from "@/lib/i18n";
import styles from "./share-page-button.module.css";

const copy = {
  ko: {
    button: "URL 복사",
    copied: "페이지 주소를 복사했어요.",
    manual: "자동으로 복사하지 못했어요. 아래 주소를 선택해 복사하세요.",
    label: "공유할 페이지 URL",
  },
  en: {
    button: "Copy URL",
    copied: "Page URL copied.",
    manual: "Could not copy automatically. Select and copy the URL below.",
    label: "Page URL to share",
  },
};

export function SharePageButton({ url, language, description }: { url: string; language: Language; description?: string }) {
  const text = copy[language];
  const request = useRef(0);
  const input = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState({ attempt: 0, message: "" });
  const [manualAttempt, setManualAttempt] = useState(0);

  useEffect(() => {
    if (manualAttempt) {
      input.current?.focus();
      input.current?.select();
    }
  }, [manualAttempt]);

  async function copyUrl() {
    const attempt = ++request.current;
    setStatus({ attempt, message: "" });
    setManualAttempt(0);
    try {
      await navigator.clipboard.writeText(url);
      if (attempt !== request.current) return;
      setStatus({ attempt, message: text.copied });
    } catch {
      if (attempt !== request.current) return;
      setManualAttempt(attempt);
      setStatus({ attempt, message: text.manual });
    }
  }

  return (
    <div className={styles.root}>
      <button className={styles.button} type="button" onClick={copyUrl}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
        {text.button}
      </button>
      {description && <p className={styles.description}>{description}</p>}
      <p className={styles.status} role="status">{status.message && <span key={status.attempt}>{status.message}</span>}</p>
      {manualAttempt > 0 && (
        <label className={styles.fallback}>
          {text.label}
          <input ref={input} type="url" value={url} readOnly dir="ltr" spellCheck={false} onFocus={event => event.currentTarget.select()} />
        </label>
      )}
    </div>
  );
}
