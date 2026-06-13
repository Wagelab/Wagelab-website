import type { Metadata } from "next";
import Link from "next/link";
import DownloadButton from "@/components/DownloadButton";

export const metadata: Metadata = {
  title: "Download the WageLab Excel Calculator",
  description:
    "Download the WageLab Excel calculator for £9.99. Save inputs, model scenarios, and use offline. 2026/27 rates.",
  alternates: { canonical: "https://www.wagelab.co.uk/download" },
};

const features = [
  "All the same calculation logic as the free online version",
  "Save your inputs and come back to them any time",
  "Model multiple scenarios side by side",
  "Use offline — no internet connection required after download",
  "Tax Bands & Rates reference sheet with all 2026/27 HMRC thresholds",
  "Mock payslip view for month-by-month comparison",
  "Detailed breakdown of every deduction",
  "Prints cleanly for meetings or accountant appointments",
];

const faqs = [
  {
    q: "What format is the file?",
    a: ".xlsx — compatible with Microsoft Excel 2016+, Google Sheets, and LibreOffice Calc.",
  },
  {
    q: "Is this a one-time purchase?",
    a: "Yes. Pay once, own it. No subscription, no recurring charges.",
  },
  {
    q: "Can I use it on a Mac?",
    a: "Yes. The file works in Excel for Mac. Some formatting may differ slightly in Google Sheets or LibreOffice.",
  },
  {
    q: "Will it work for previous tax years?",
    a: "The file contains 2026/27 rates. It does not automatically update for previous years, but the Tax Bands & Rates sheet shows all current thresholds.",
  },
  {
    q: "What is the refund policy?",
    a: "Due to the digital nature of the product, we do not offer refunds once the file has been downloaded. Please use the free online calculator to check the calculations meet your needs before purchasing.",
  },
];

export default function DownloadPage() {
  return (
    <>
      {/* Header */}
      <section style={{ background: "#0F3460" }} className="py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p
            style={{
              color: "#FF00FF",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            One-time purchase · Instant download
          </p>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "#ffffff",
              marginBottom: 8,
              fontFamily: "var(--font-dm-sans), Arial, sans-serif",
            }}
          >
            Download the WageLab Excel Calculator
          </h1>
          <p style={{ color: "#93C5FD", fontSize: 14 }}>
            The full calculator in a spreadsheet you own — offline, saveable, and printable.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
          {/* Main content */}
          <div>
            {/* What's included */}
            <div
              style={{
                background: "#ffffff",
                border: "1px solid #E2E8F0",
                borderRadius: 8,
                borderTop: "4px solid #FF00FF",
                padding: "28px 32px",
                marginBottom: 24,
              }}
            >
              <h2
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#0F3460",
                  marginBottom: 16,
                  fontFamily: "var(--font-dm-sans), Arial, sans-serif",
                }}
              >
                What&apos;s included
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {features.map((feature, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                    }}
                  >
                    <span style={{ color: "#22c55e", fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                      ✓
                    </span>
                    <span style={{ fontSize: 14, color: "#334155", lineHeight: 1.5 }}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQs */}
            <div
              style={{
                background: "#ffffff",
                border: "1px solid #E2E8F0",
                borderRadius: 8,
                padding: "28px 32px",
              }}
            >
              <h2
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#0F3460",
                  marginBottom: 16,
                  fontFamily: "var(--font-dm-sans), Arial, sans-serif",
                }}
              >
                Common questions
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {faqs.map(({ q, a }) => (
                  <div
                    key={q}
                    style={{ borderBottom: "1px solid #F1F5F9", padding: "14px 0" }}
                  >
                    <p
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#0F3460",
                        marginBottom: 4,
                        fontFamily: "var(--font-dm-sans), Arial, sans-serif",
                      }}
                    >
                      {q}
                    </p>
                    <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.6 }}>
                      {a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Checkout card */}
          <div
            style={{
              background: "#0F3460",
              borderRadius: 8,
              borderTop: "4px solid #FF00FF",
              padding: "28px 24px",
              position: "sticky",
              top: 80,
            }}
          >
            <p
              style={{
                fontSize: 12,
                color: "#93C5FD",
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              WageLab Excel Calculator
            </p>
            <p
              style={{
                fontSize: 36,
                fontWeight: 700,
                color: "#ffffff",
                fontFamily: "var(--font-dm-mono), monospace",
                lineHeight: 1.1,
                marginBottom: 4,
              }}
            >
              £9.99
            </p>
            <p style={{ fontSize: 12, color: "#64748B", marginBottom: 20 }}>
              One-time purchase · No subscription
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
              {[
                "Instant .xlsx download",
                "2026/27 HMRC rates",
                "Offline use",
                "Personal licence",
              ].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: "#22c55e", fontSize: 13 }}>✓</span>
                  <span style={{ fontSize: 13, color: "#94A3B8" }}>{item}</span>
                </div>
              ))}
            </div>

            <DownloadButton />

            <p style={{ fontSize: 11, color: "#64748B", marginTop: 12, textAlign: "center" }}>
              Secure checkout via Stripe. No account required.
            </p>

            <div
              style={{
                borderTop: "1px solid #1e3a5f",
                marginTop: 16,
                paddingTop: 16,
              }}
            >
              <p style={{ fontSize: 11, color: "#64748B", textAlign: "center" }}>
                Want to try first?{" "}
                <Link href="/calculator" style={{ color: "#93C5FD" }}>
                  Use the free online calculator
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
