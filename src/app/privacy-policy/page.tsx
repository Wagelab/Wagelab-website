import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "WageLab privacy policy — how we collect, use, and protect your data.",
  alternates: { canonical: "https://www.wagelab.co.uk/privacy-policy" },
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
  h3: {
    fontSize: 15,
    fontWeight: 600,
    color: "#0F3460",
    marginTop: 20,
    marginBottom: 6,
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
};

import React from "react";

export default function PrivacyPolicyPage() {
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
            Privacy Policy
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
          <h2 style={s.h2}>1. Who we are</h2>
          <p style={s.p}>
            WageLab operates the website at wagelab.co.uk (the &ldquo;Site&rdquo;). For the
            purposes of UK data protection law, WageLab is the data controller for any
            personal data collected through this Site.
          </p>
          <p style={s.p}>
            Contact:{" "}
            <a href="mailto:hello@wagelab.co.uk" style={{ color: "#3B82F6" }}>
              hello@wagelab.co.uk
            </a>
          </p>

          <h2 style={s.h2}>2. What data we collect</h2>

          <h3 style={s.h3}>Data you enter into the calculator</h3>
          <p style={s.p}>
            The calculator on this Site processes data you enter (such as salary, pension
            contribution, and tax information) entirely within your browser. This data is
            not transmitted to our servers, not stored, and not accessible by WageLab.
          </p>

          <h3 style={s.h3}>Data collected automatically</h3>
          <p style={s.p}>
            When you visit the Site, we automatically collect certain technical information
            through Google Analytics 4, including:
          </p>
          <ul style={{ paddingLeft: 20, marginBottom: 12 }}>
            {[
              "Pages visited and time spent on each page",
              "Approximate geographic location (country and region — not precise location)",
              "Device type, browser, and operating system",
              "How you arrived at the Site (search engine, direct, referral)",
              "Interactions with the calculator (e.g. which tabs are used)",
            ].map((item) => (
              <li key={item} style={s.li}>
                {item}
              </li>
            ))}
          </ul>
          <p style={s.p}>
            This data is collected via cookies and similar tracking technologies. It is
            aggregated and anonymised and is used solely to understand how the Site is
            used and improve it.
          </p>

          <h3 style={s.h3}>Data you provide voluntarily</h3>
          <p style={s.p}>
            If you contact us by email, we will collect the information you include in that
            communication (name, email address, and the content of your message). This is
            used solely to respond to your enquiry.
          </p>

          <h2 style={s.h2}>3. Cookies</h2>
          <p style={s.p}>We use the following cookies on this Site:</p>
          <ul style={{ paddingLeft: 20, marginBottom: 12 }}>
            {[
              "Google Analytics cookies: Used to distinguish users and track usage. These are analytics cookies and are only set with your consent.",
              "Google AdSense / advertising cookies: Where you have given consent to advertising cookies, Google AdSense may set cookies to serve personalised advertisements based on your browsing interests.",
              "Cookie consent cookie: Remembers your cookie preferences for analytics and advertising separately.",
            ].map((item) => (
              <li key={item} style={s.li}>
                {item}
              </li>
            ))}
          </ul>
          <p style={s.p}>
            You can withdraw your consent to analytics or advertising cookies at any time
            by clearing your browser cookies, which will cause the consent banner to
            reappear. The Site will continue to function without analytics or advertising
            cookies.
          </p>

          <h2 style={s.h2}>4. Legal basis for processing</h2>
          <p style={s.p}>
            We process data collected via Google Analytics and Google AdSense on the legal
            basis of your consent (UK GDPR Article 6(1)(a)). We operate a two-tier consent
            system: analytics cookies require separate consent from advertising cookies.
          </p>
          <p style={s.p}>
            We process data you send us by email on the legal basis of legitimate interests
            (UK GDPR Article 6(1)(f)) — specifically our legitimate interest in responding
            to enquiries about the Site.
          </p>

          <h2 style={s.h2}>5. Third parties</h2>

          <h3 style={s.h3}>Google Analytics</h3>
          <p style={s.p}>
            We use Google Analytics 4, operated by Google LLC. Data collected by Google
            Analytics may be transferred to and stored on servers in the United States.
            Google LLC is certified under the EU-US Data Privacy Framework.
          </p>

          <h3 style={s.h3}>Affiliate links</h3>
          <p style={s.p}>
            This Site contains links to third-party financial services websites. When you
            click these links, you will leave the WageLab Site and be subject to the
            privacy policies of those third-party sites. We have no control over, and no
            responsibility for, the content or privacy practices of those sites.
          </p>

          <h2 style={s.h2}>6. Your rights</h2>
          <p style={s.p}>
            Under UK GDPR, you have the following rights regarding your personal data:
          </p>
          <ul style={{ paddingLeft: 20, marginBottom: 12 }}>
            {[
              "The right to access the personal data we hold about you",
              "The right to rectification if that data is inaccurate",
              "The right to erasure (\"right to be forgotten\")",
              "The right to restrict processing",
              "The right to object to processing",
              "The right to data portability",
              "The right to withdraw consent at any time (for consent-based processing)",
            ].map((item) => (
              <li key={item} style={s.li}>
                {item}
              </li>
            ))}
          </ul>
          <p style={s.p}>
            To exercise any of these rights, please contact us at{" "}
            <a href="mailto:hello@wagelab.co.uk" style={{ color: "#3B82F6" }}>
              hello@wagelab.co.uk
            </a>
            . We will respond within 30 days.
          </p>

          <h2 style={s.h2}>7. Data retention</h2>
          <p style={s.p}>
            Email correspondence is retained for up to 12 months and then deleted. Google
            Analytics data is retained for 14 months as configured in our GA4 account.
          </p>

          <h2 style={s.h2}>8. Complaints</h2>
          <p style={s.p}>
            If you are unhappy with how we handle your personal data, you have the right
            to lodge a complaint with the UK Information Commissioner&apos;s Office (ICO) at{" "}
            <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" style={{ color: "#3B82F6" }}>
              ico.org.uk
            </a>{" "}
            or by calling 0303 123 1113.
          </p>

          <h2 style={s.h2}>9. Changes to this policy</h2>
          <p style={s.p}>
            We may update this Privacy Policy from time to time. The date at the top of
            this page shows when it was last revised. Continued use of the Site after any
            update constitutes acceptance of the revised policy.
          </p>
        </div>
      </div>
    </>
  );
}
