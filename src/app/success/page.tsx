import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Download Ready — Thank You",
  description: "Your WageLab Excel Calculator download is ready.",
  robots: { index: false, follow: false },
};

export default function SuccessPage() {
  return (
    <div style={{ background: "#F8FAFF", minHeight: "100vh" }}>
      {/* Hero */}
      <div style={{ background: "#0F3460", padding: "48px 24px 40px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <div
            style={{
              width: 56,
              height: 56,
              background: "rgba(34,197,94,0.15)",
              border: "2px solid #22c55e",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
            }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#22c55e"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: "#ffffff",
              lineHeight: 1.25,
              marginBottom: 12,
              fontFamily: "var(--font-dm-sans), Arial, sans-serif",
            }}
          >
            Thank you — your download is ready
          </h1>
          <p style={{ color: "#93C5FD", fontSize: 15, lineHeight: 1.7 }}>
            Your payment was successful. The WageLab Excel Calculator is ready to download.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "40px 24px 64px" }}>
        {/* Download card */}
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #E2E8F0",
            borderRadius: 12,
            padding: "32px",
            textAlign: "center",
            marginBottom: 24,
          }}
        >
          <p
            style={{
              color: "#334155",
              fontSize: 15,
              lineHeight: 1.7,
              marginBottom: 28,
            }}
          >
            Click the button below to download your file.
          </p>

          <a
            href="/Wagelab_Excel_Tax_Calculator_DOWNLOAD.xlsx"
            download
            style={{
              display: "inline-block",
              background: "#FF00FF",
              color: "#ffffff",
              fontWeight: 700,
              fontSize: 15,
              padding: "14px 32px",
              borderRadius: 24,
              fontFamily: "var(--font-dm-sans), Arial, sans-serif",
              marginBottom: 16,
            }}
          >
            Download the Excel Calculator
          </a>

          <p style={{ color: "#94a3b8", fontSize: 12 }}>
            Microsoft Excel (.xlsx) · 2026/27 HMRC rates · Single user licence
          </p>
        </div>

        {/* What's next */}
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #E2E8F0",
            borderRadius: 12,
            padding: "28px 32px",
            marginBottom: 24,
          }}
        >
          <h2
            style={{
              fontSize: 17,
              fontWeight: 700,
              color: "#0F3460",
              marginBottom: 12,
              fontFamily: "var(--font-dm-sans), Arial, sans-serif",
            }}
          >
            Making the most of your calculator
          </h2>
          <p style={{ color: "#64748B", fontSize: 14, lineHeight: 1.75, marginBottom: 16 }}>
            The Excel calculator includes the same verified calculations as the free online version
            — plus the ability to save your inputs, model different scenarios side by side, and view
            a month-by-month mock payslip.
          </p>
          <p style={{ color: "#64748B", fontSize: 14, lineHeight: 1.75, marginBottom: 20 }}>
            If you have questions about any of the inputs or results, our articles section explains
            every feature in plain English — from salary sacrifice to student loan repayments to the
            £100,000 Personal Allowance taper.
          </p>
          <Link
            href="/articles"
            style={{
              color: "#3B82F6",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Browse articles →
          </Link>
        </div>

        {/* Disclaimer */}
        <div
          style={{
            background: "#F8FAFF",
            border: "1px solid #E2E8F0",
            borderRadius: 10,
            padding: "16px 20px",
            marginBottom: 20,
          }}
        >
          <p style={{ color: "#64748B", fontSize: 12, lineHeight: 1.7 }}>
            <strong style={{ color: "#334155" }}>Important:</strong> Results produced by the
            WageLab Excel Calculator are estimates based on 2026/27 HMRC rates and are for
            illustrative purposes only. This is not financial or tax advice. WageLab is not
            regulated by the FCA. If you are unsure about your personal tax position please seek
            independent advice from a qualified financial adviser.
          </p>
        </div>

        {/* Support */}
        <p style={{ color: "#64748B", fontSize: 13, textAlign: "center" }}>
          Having trouble with your download?{" "}
          <a href="mailto:hello@wagelab.co.uk" style={{ color: "#3B82F6" }}>
            Contact us at hello@wagelab.co.uk
          </a>
        </p>
      </div>
    </div>
  );
}
