"use client";

import Script from "next/script";
import { useEffect } from "react";

const GA_ID = "G-E0RXJB62B6";

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

function enableAnalytics() {
  if (typeof window.gtag !== "function") return;
  window.gtag("consent", "update", { analytics_storage: "granted" });
  window.gtag("event", "page_view");
}

export default function GoogleAnalytics() {
  useEffect(() => {
    // Returning visitor — consent already stored
    if (localStorage.getItem("wagelab-consent-analytics") === "accepted") {
      enableAnalytics();
    }

    // New consent given this session
    function onConsent(e: Event) {
      if ((e as CustomEvent).detail?.analytics) enableAnalytics();
    }
    window.addEventListener("cookie-consent", onConsent);
    return () => window.removeEventListener("cookie-consent", onConsent);
  }, []);

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('consent', 'default', { analytics_storage: 'denied' });
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { send_page_view: false });
        `}
      </Script>
    </>
  );
}
