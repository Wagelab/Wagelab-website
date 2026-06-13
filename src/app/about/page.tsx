import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About WageLab",
  description:
    "WageLab is a free UK take-home pay calculator built for people who want to understand their payslip properly — not just see a number.",
  alternates: { canonical: "https://www.wagelab.co.uk/about" },
};

const features = [
  "Handles all three pension methods correctly for both tax and NI",
  "Applies the £100,000 Personal Allowance taper and 60% rate correctly",
  "Calculates student loan repayments using HMRC monthly floor method",
  "Covers all six Scottish Income Tax bands",
  "Shows Adjusted Net Income — controls PA, Child Benefit, free childcare",
  "Includes a mock payslip for month-by-month comparison",
  "Dividend and savings income with correct band ordering",
  "Cycle to Work, Gift Aid, Marriage Allowance, and Blind Person's Allowance",
];

const stats = [
  { value: "36/36", label: "Test cases passing", color: "#22c55e" },
  { value: "3", label: "Pension methods", color: "#3B82F6" },
  { value: "5", label: "Student loan plans", color: "#FF00FF" },
  { value: "6", label: "Scottish bands", color: "#f59e0b" },
];

export default function AboutPage() {
  return (
    <>
      {/* Page header */}
      <section style={{ background: "#0F3460" }} className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "#ffffff",
              marginBottom: 8,
              fontFamily: "var(--font-dm-sans), Arial, sans-serif",
            }}
          >
            About WageLab
          </h1>
          <p style={{ color: "#93C5FD", fontSize: 14 }}>
            Built for people who want to understand their payslip properly.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-[1fr_auto] gap-8">
          {/* Main content */}
          <div>
            {/* Main card */}
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
                  marginBottom: 12,
                  fontFamily: "var(--font-dm-sans), Arial, sans-serif",
                }}
              >
                What is WageLab?
              </h2>
              <p
                style={{
                  fontSize: 14,
                  color: "#1E293B",
                  lineHeight: 1.7,
                  marginBottom: 12,
                }}
              >
                WageLab is a free UK take-home pay calculator built for people
                who want to understand their payslip properly — not just see a
                number.
              </p>
              <p
                style={{
                  fontSize: 14,
                  color: "#1E293B",
                  lineHeight: 1.7,
                  marginBottom: 20,
                }}
              >
                The UK tax system is genuinely complicated. Salary sacrifice
                reduces both your tax and your National Insurance. Relief at
                Source pensions work differently from Net Pay Arrangement
                pensions. The Personal Allowance disappears above £100,000.
                Most calculators ignore these details. WageLab doesn't.
              </p>

              <h3
                style={{
                  fontSize: 17,
                  fontWeight: 700,
                  color: "#0F3460",
                  marginBottom: 12,
                  fontFamily: "var(--font-dm-sans), Arial, sans-serif",
                }}
              >
                What makes it different?
              </h3>
              <div>
                {features.map((feature, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                      padding: "8px 12px",
                      background: i % 2 === 0 ? "#ffffff" : "#F8FAFF",
                      border: "1px solid #E2E8F0",
                      borderRadius: 4,
                      marginBottom: 4,
                    }}
                  >
                    <span
                      style={{
                        color: "#22c55e",
                        fontWeight: 700,
                        fontSize: 13,
                        flexShrink: 0,
                        marginTop: 1,
                      }}
                    >
                      ✓
                    </span>
                    <span style={{ fontSize: 13, color: "#64748B", lineHeight: 1.5 }}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <h3
                style={{
                  fontSize: 17,
                  fontWeight: 700,
                  color: "#0F3460",
                  marginTop: 24,
                  marginBottom: 10,
                  fontFamily: "var(--font-dm-sans), Arial, sans-serif",
                }}
              >
                Is this financial advice?
              </h3>
              <div
                style={{
                  background: "#FFFBEB",
                  border: "1px solid #FDE68A",
                  borderRadius: 6,
                  padding: "12px 16px",
                  marginBottom: 20,
                }}
              >
                <p style={{ fontSize: 13, color: "#92400E", lineHeight: 1.6 }}>
                  <strong>No.</strong> WageLab is not FCA regulated and does
                  not provide financial advice or personal recommendations. Seek
                  independent advice from an FCA-authorised financial adviser
                  before making any financial decision.
                </p>
              </div>

              <h3
                style={{
                  fontSize: 17,
                  fontWeight: 700,
                  color: "#0F3460",
                  marginBottom: 10,
                  fontFamily: "var(--font-dm-sans), Arial, sans-serif",
                }}
              >
                Is my data stored?
              </h3>
              <p style={{ fontSize: 14, color: "#1E293B", lineHeight: 1.7 }}>
                No. All calculations run entirely in your browser. Nothing you
                enter is transmitted to any server or stored anywhere. We have
                no access to the figures you enter.
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ width: 320, flexShrink: 0 }}>
            {/* Accuracy stats */}
            <div
              style={{
                background: "#0F3460",
                borderRadius: 8,
                borderTop: "4px solid #FF00FF",
                padding: "20px 24px",
                marginBottom: 16,
              }}
            >
              <h3
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#ffffff",
                  marginBottom: 16,
                  fontFamily: "var(--font-dm-sans), Arial, sans-serif",
                }}
              >
                Calculator accuracy
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    style={{
                      background: "#1e3a5f",
                      borderRadius: 8,
                      padding: "14px 12px",
                      textAlign: "center",
                    }}
                  >
                    <p
                      style={{
                        fontSize: 28,
                        fontWeight: 700,
                        color: stat.color,
                        fontFamily: "var(--font-dm-mono), monospace",
                        lineHeight: 1,
                        marginBottom: 4,
                      }}
                    >
                      {stat.value}
                    </p>
                    <p style={{ fontSize: 10, color: "#94a3b8", lineHeight: 1.3 }}>
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Data privacy */}
            <div
              style={{
                background: "#ffffff",
                border: "1px solid #E2E8F0",
                borderRadius: 8,
                padding: "20px 24px",
                marginBottom: 16,
              }}
            >
              <h3
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#0F3460",
                  marginBottom: 8,
                  fontFamily: "var(--font-dm-sans), Arial, sans-serif",
                }}
              >
                Is my data stored?
              </h3>
              <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.6, marginBottom: 8 }}>
                No. Calculations happen in your browser. Nothing is sent to any
                server or stored.
              </p>
              <p style={{ fontSize: 12, color: "#22c55e", fontWeight: 500 }}>
                ✓ Zero data collected · Zero sign-up required
              </p>
            </div>

            {/* Contact */}
            <div
              style={{
                background: "#EFF6FF",
                border: "1px solid #3B82F6",
                borderRadius: 8,
                padding: "20px 24px",
              }}
            >
              <h3
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#0F3460",
                  marginBottom: 8,
                  fontFamily: "var(--font-dm-sans), Arial, sans-serif",
                }}
              >
                Contact
              </h3>
              <a
                href="mailto:hello@wagelab.co.uk"
                style={{ fontSize: 13, color: "#3B82F6", display: "block", marginBottom: 4 }}
              >
                hello@wagelab.co.uk
              </a>
              <p style={{ fontSize: 12, color: "#64748B", fontStyle: "italic" }}>
                Responses within 2–3 working days
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <Link
            href="/calculator"
            style={{
              background: "#FF00FF",
              color: "#ffffff",
              fontWeight: 700,
              fontSize: 14,
              padding: "12px 28px",
              borderRadius: 24,
              fontFamily: "var(--font-dm-sans), Arial, sans-serif",
              display: "inline-block",
            }}
            className="hover:opacity-90 transition-opacity"
          >
            Try the free calculator →
          </Link>
        </div>
      </div>
    </>
  );
}
