import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "WageLab cookie policy — how we use cookies on this site.",
  alternates: { canonical: "https://www.wagelab.co.uk/cookie-policy" },
};

const s = {
  h2: {
    fontSize: 17,
    fontWeight: 700,
    color: "#0F3460",
    marginTop: 28,
    marginBottom: 8,
    fontFamily: "var(--font-dm-sans), Arial, sans-serif",
  } as React.CSSProperties,
  p: {
    fontSize: 14,
    color: "#334155",
    lineHeight: 1.75,
    marginBottom: 12,
  } as React.CSSProperties,
  li: {
    fontSize: 14,
    color: "#334155",
    lineHeight: 1.7,
    marginBottom: 4,
  } as React.CSSProperties,
  td: {
    fontSize: 13,
    color: "#334155",
    padding: "10px 12px",
    borderBottom: "1px solid #E2E8F0",
    verticalAlign: "top" as const,
    lineHeight: 1.5,
  } as React.CSSProperties,
  th: {
    fontSize: 12,
    fontWeight: 600,
    color: "#64748B",
    padding: "10px 12px",
    textAlign: "left" as const,
    background: "#F8FAFF",
    borderBottom: "2px solid #E2E8F0",
  } as React.CSSProperties,
};

const cookies = [
  {
    name: "_ga",
    type: "Analytics",
    purpose: "Distinguishes users",
    duration: "2 years",
    provider: "Google",
  },
  {
    name: "_ga_*",
    type: "Analytics",
    purpose: "Stores session state",
    duration: "2 years",
    provider: "Google",
  },
  {
    name: "IDE / _gads",
    type: "Advertising",
    purpose:
      "Used by Google AdSense to register and report user actions after viewing or clicking an ad.",
    duration: "Up to 13 months",
    provider: "Google",
  },
  {
    name: "test_cookie",
    type: "Advertising",
    purpose: "Used by Google to check whether the user's browser supports cookies.",
    duration: "Session",
    provider: "Google",
  },
  {
    name: "wagelab_consent",
    type: "Functional",
    purpose: "Stores cookie consent preference",
    duration: "1 year",
    provider: "WageLab",
  },
];

export default function CookiePolicyPage() {
  return (
    <>
      <section style={{ background: "#0F3460" }} className="py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "#ffffff",
              marginBottom: 8,
              fontFamily: "var(--font-dm-sans), Arial, sans-serif",
            }}
          >
            Cookie Policy
          </h1>
          <p style={{ color: "#93C5FD", fontSize: 14 }}>Last updated: June 2026</p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #E2E8F0",
            borderRadius: 8,
            padding: "32px 36px",
          }}
        >
          <h2 style={{ ...s.h2, marginTop: 0 }}>What are cookies?</h2>
          <p style={s.p}>
            Cookies are small text files placed on your device by websites you visit. They
            are widely used to make websites work, improve performance, and provide
            information to website owners.
          </p>

          <h2 style={s.h2}>Cookies we use</h2>
          <div style={{ overflowX: "auto", marginBottom: 16 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
              <thead>
                <tr>
                  {["Cookie", "Type", "Purpose", "Duration", "Provider"].map((h) => (
                    <th key={h} style={s.th}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cookies.map((c) => (
                  <tr key={c.name}>
                    <td style={{ ...s.td, fontFamily: "var(--font-dm-mono), monospace", fontSize: 12 }}>
                      {c.name}
                    </td>
                    <td style={s.td}>{c.type}</td>
                    <td style={s.td}>{c.purpose}</td>
                    <td style={s.td}>{c.duration}</td>
                    <td style={s.td}>{c.provider}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 style={s.h2}>Managing cookies</h2>
          <p style={s.p}>
            When you first visit WageLab, you will see a cookie banner asking for your
            consent to analytics cookies. You can:
          </p>
          <ul style={{ paddingLeft: 20, marginBottom: 12 }}>
            {[
              "Accept all cookies — analytics cookies will be set and Google Analytics will track your visit",
              "Decline — only the essential consent cookie will be set; no analytics data will be collected",
            ].map((item) => (
              <li key={item} style={s.li}>
                {item}
              </li>
            ))}
          </ul>
          <p style={s.p}>
            You can change your preference at any time by clearing your browser cookies,
            which will cause the consent banner to reappear on your next visit.
          </p>
          <p style={s.p}>
            You can also manage cookies through your browser settings. For instructions,
            visit your browser&apos;s help section or{" "}
            <a
              href="https://www.allaboutcookies.org"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#3B82F6" }}
            >
              allaboutcookies.org
            </a>
            .
          </p>

          <h2 style={s.h2}>Essential cookies</h2>
          <p style={s.p}>
            The <span style={{ fontFamily: "var(--font-dm-mono), monospace", fontSize: 13 }}>wagelab_consent</span> cookie
            is essential to the operation of our cookie consent system. It cannot be
            disabled while you use the Site. It stores no personal information — only your
            cookie preference (accepted or declined).
          </p>

          <h2 style={s.h2}>Contact</h2>
          <p style={s.p}>
            If you have questions about our use of cookies, please contact us at{" "}
            <a href="mailto:hello@wagelab.co.uk" style={{ color: "#3B82F6" }}>
              hello@wagelab.co.uk
            </a>
            .
          </p>
        </div>
      </div>
    </>
  );
}
