"use client";

import { useState, useEffect } from "react";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("wagelab-cookie-consent");
    if (!consent) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem("wagelab-cookie-consent", "accepted");
    setVisible(false);
    // GA4 fires after consent — dispatch event for gtag to listen to
    window.dispatchEvent(new Event("cookie-consent-accepted"));
  }

  function decline() {
    localStorage.setItem("wagelab-cookie-consent", "declined");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "#0F3460",
        borderTop: "3px solid #FF00FF",
        padding: "16px 24px",
        zIndex: 1000,
        display: "flex",
        flexWrap: "wrap",
        gap: 12,
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <p
        style={{
          color: "#93C5FD",
          fontSize: 13,
          lineHeight: 1.6,
          flex: "1 1 300px",
          fontFamily: "var(--font-dm-sans), Arial, sans-serif",
        }}
      >
        We use cookies to measure site traffic with Google Analytics. No
        personal data from the calculator is ever stored or transmitted.{" "}
        <a
          href="/cookie-policy"
          style={{ color: "#ffffff", textDecoration: "underline" }}
        >
          Cookie Policy
        </a>
      </p>
      <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
        <button
          onClick={accept}
          style={{
            background: "#FF00FF",
            color: "#ffffff",
            fontWeight: 700,
            fontSize: 13,
            padding: "8px 20px",
            borderRadius: 20,
            border: "none",
            cursor: "pointer",
            fontFamily: "var(--font-dm-sans), Arial, sans-serif",
          }}
        >
          Accept
        </button>
        <button
          onClick={decline}
          style={{
            background: "transparent",
            color: "#93C5FD",
            fontWeight: 400,
            fontSize: 13,
            padding: "8px 16px",
            borderRadius: 20,
            border: "1px solid rgba(147,197,253,0.3)",
            cursor: "pointer",
            fontFamily: "var(--font-dm-sans), Arial, sans-serif",
          }}
        >
          Decline
        </button>
      </div>
    </div>
  );
}
