"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { analytics, analyticsInitialization, shouldLoadAnalytics } from "@/lib/analytics";

export function GoogleAnalytics() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    setAllowed(shouldLoadAnalytics(window.location.origin, process.env.NODE_ENV === "production"));
  }, []);

  if (!allowed) return null;

  // Enhanced measurement handles history changes; do not send manual page views here.
  return <>
    <Script id="ga4-initialization" strategy="afterInteractive">{analyticsInitialization}</Script>
    <Script id="ga4-loader" strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${analytics.measurementId}`} />
  </>;
}
