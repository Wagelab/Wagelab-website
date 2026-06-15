"use client";

import { useState, useEffect } from "react";

const CONSENT_ANALYTICS = "wagelab-consent-analytics";
const CONSENT_ADVERTISING = "wagelab-consent-advertising";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [advertising, setAdvertising] = useState(false);
  const adsenseEnabled = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true";

  useEffect(() => {
    const hasAnalytics = localStorage.getItem(CONSENT_ANALYTICS);
    const hasAds = localStorage.getItem(CONSENT_ADVERTISING);
    if (!hasAnalytics || (!hasAds && adsenseEnabled)) setVisible(true);
  }, [adsenseEnabled]);

  function saveAndClose(analyticsChoice: boolean, advertisingChoice: boolean) {
    localStorage.setItem(CONSENT_ANALYTICS, analyticsChoice ? "accepted" : "declined");
    if (adsenseEnabled) {
      localStorage.setItem(CONSENT_ADVERTISING, advertisingChoice ? "accepted" : "declined");
    }
    if (analyticsChoice) {
      window.dispatchEvent(new CustomEvent("cookie-consent", { detail: { analytics: true } }));
    }
    if (advertisingChoice && adsenseEnabled) {
      window.dispatchEvent(new CustomEvent("cookie-consent", { detail: { advertising: true } }));
    }
    setVisible(false);
  }

  function acceptAll() {
    saveAndClose(true, true);
  }

  function declineAll() {
    saveAndClose(false, false);
  }

  function saveChoices() {
    saveAndClose(analytics, adsenseEnabled ? advertising : false);
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
        padding: "20px 24px",
        zIndex: 1000,
        fontFamily: "var(--font-dm-sans), Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 20,
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          {/* Text + toggles */}
          <div style={{ flex: "1 1 420px" }}>
            <p
              style={{
                color: "#93C5FD",
                fontSize: 13,
                lineHeight: 1.6,
                marginBottom: 14,
              }}
            >
              We use cookies to improve your experience. No personal data from the calculator is ever
              stored or transmitted.{" "}
              <a
                href="/cookie-policy"
                style={{ color: "#ffffff", textDecoration: "underline" }}
              >
                Cookie Policy
              </a>
            </p>

            {/* Two-tier toggles */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {/* Analytics */}
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  cursor: "pointer",
                }}
              >
                <div
                  onClick={() => setAnalytics(!analytics)}
                  role="checkbox"
                  aria-checked={analytics}
                  aria-label="Analytics cookies"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === " " && setAnalytics(!analytics)}
                  style={{
                    width: 40,
                    height: 22,
                    borderRadius: 11,
                    background: analytics ? "#FF00FF" : "rgba(255,255,255,0.15)",
                    position: "relative",
                    transition: "background 0.2s",
                    flexShrink: 0,
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 3,
                      left: analytics ? 21 : 3,
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      background: "#ffffff",
                      transition: "left 0.2s",
                    }}
                  />
                </div>
                <div>
                  <span style={{ color: "#ffffff", fontSize: 13, fontWeight: 600 }}>
                    Analytics (Google Analytics)
                  </span>
                  <span
                    style={{ display: "block", color: "#93C5FD", fontSize: 11, marginTop: 1 }}
                  >
                    Helps us understand how visitors use the site
                  </span>
                </div>
              </label>

              {/* Advertising — only when AdSense is enabled */}
              {adsenseEnabled && (
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    cursor: "pointer",
                  }}
                >
                  <div
                    onClick={() => setAdvertising(!advertising)}
                    role="checkbox"
                    aria-checked={advertising}
                    aria-label="Advertising cookies"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === " " && setAdvertising(!advertising)}
                    style={{
                      width: 40,
                      height: 22,
                      borderRadius: 11,
                      background: advertising ? "#FF00FF" : "rgba(255,255,255,0.15)",
                      position: "relative",
                      transition: "background 0.2s",
                      flexShrink: 0,
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: 3,
                        left: advertising ? 21 : 3,
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        background: "#ffffff",
                        transition: "left 0.2s",
                      }}
                    />
                  </div>
                  <div>
                    <span style={{ color: "#ffffff", fontSize: 13, fontWeight: 600 }}>
                      Advertising (Google AdSense)
                    </span>
                    <span
                      style={{ display: "block", color: "#93C5FD", fontSize: 11, marginTop: 1 }}
                    >
                      Personalised ads based on your browsing
                    </span>
                  </div>
                </label>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              flexShrink: 0,
              minWidth: 160,
            }}
          >
            <button
              onClick={acceptAll}
              style={{
                background: "#FF00FF",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: 13,
                padding: "9px 20px",
                borderRadius: 20,
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--font-dm-sans), Arial, sans-serif",
                width: "100%",
              }}
            >
              Accept all
            </button>
            <button
              onClick={saveChoices}
              style={{
                background: "transparent",
                color: "#ffffff",
                fontWeight: 600,
                fontSize: 13,
                padding: "9px 20px",
                borderRadius: 20,
                border: "1px solid rgba(255,255,255,0.4)",
                cursor: "pointer",
                fontFamily: "var(--font-dm-sans), Arial, sans-serif",
                width: "100%",
              }}
            >
              Save choices
            </button>
            <button
              onClick={declineAll}
              style={{
                background: "transparent",
                color: "#93C5FD",
                fontWeight: 400,
                fontSize: 12,
                padding: "6px 16px",
                borderRadius: 20,
                border: "1px solid rgba(147,197,253,0.3)",
                cursor: "pointer",
                fontFamily: "var(--font-dm-sans), Arial, sans-serif",
                width: "100%",
              }}
            >
              Decline all
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
