import type { Metadata } from "next";
import Link from "next/link";
import { getAllArticles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "WageLab – UK Take-Home Pay Calculator 2026/27",
  description:
    "Free UK take-home pay calculator for 2026/27. Salary sacrifice, pension, dividends, student loans, Scottish tax bands — all in one place.",
  alternates: { canonical: "https://www.wagelab.co.uk" },
};

const features = [
  "Salary sacrifice",
  "3 pension methods",
  "5 student loan plans",
  "Scottish bands",
  "Mock payslip",
  "Gift Aid",
  "PA taper & 60% rate",
  "Dividends & savings",
];

export default async function HomePage() {
  const articles = (await Promise.resolve(getAllArticles())).slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section style={{ background: "#0F3460" }} className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1
                style={{ fontFamily: "var(--font-dm-sans), Arial, sans-serif" }}
                className="text-4xl lg:text-5xl font-bold leading-tight mb-4"
              >
                <span style={{ color: "#ffffff" }}>Your UK take-home pay,</span>
                <br />
                <span style={{ color: "#FF00FF" }}>calculated properly.</span>
              </h1>
              <p
                style={{ color: "#93C5FD", fontSize: 16, lineHeight: 1.7 }}
                className="mb-6"
              >
                Salary, pension, tax codes, dividends, salary sacrifice, student
                loans — all in one place. Updated for 2026/27.
              </p>

              {/* Feature chips */}
              <div className="flex flex-wrap gap-2 mb-8">
                {features.map((f) => (
                  <span
                    key={f}
                    style={{
                      background: "#1e3a5f",
                      color: "#93C5FD",
                      fontSize: 12,
                      padding: "5px 12px",
                      borderRadius: 20,
                      fontFamily: "var(--font-dm-sans), Arial, sans-serif",
                    }}
                  >
                    {f}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-4 flex-wrap">
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
                  }}
                  className="hover:opacity-90 transition-opacity inline-block"
                >
                  Calculate my take-home pay →
                </Link>
                <span style={{ color: "#64748B", fontSize: 13 }}>
                  Free · No sign-up · No data stored
                </span>
              </div>
            </div>

            {/* Hero result preview card */}
            <div
              style={{
                background: "#0a1f3d",
                border: "1px solid #3B82F6",
                borderRadius: 12,
                padding: 28,
              }}
            >
              <p
                style={{
                  fontSize: 10,
                  letterSpacing: "0.15em",
                  color: "#64748B",
                  textTransform: "uppercase",
                  textAlign: "center",
                  marginBottom: 8,
                  fontFamily: "var(--font-dm-sans), Arial, sans-serif",
                }}
              >
                NET TAKE-HOME EXAMPLE
              </p>
              <p
                style={{
                  fontSize: 52,
                  fontWeight: 900,
                  color: "#FF00FF",
                  textAlign: "center",
                  fontFamily: "var(--font-dm-mono), monospace",
                  letterSpacing: "-2px",
                  lineHeight: 1,
                  marginBottom: 6,
                }}
              >
                £42,107
              </p>
              <p
                style={{
                  color: "#64748B",
                  fontSize: 13,
                  textAlign: "center",
                  marginBottom: 20,
                }}
              >
                £3,509 per month · on a £60,000 salary
              </p>
              <div style={{ borderTop: "1px solid #1e3a5f", paddingTop: 16 }}>
                {[
                  ["Income Tax", "−£11,432"],
                  ["National Insurance", "−£3,461"],
                  ["Pension (SS)", "−£3,000"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex justify-between mb-3"
                    style={{ fontFamily: "var(--font-dm-sans), Arial, sans-serif" }}
                  >
                    <span style={{ color: "#94a3b8", fontSize: 13 }}>{label}</span>
                    <span
                      style={{
                        color: "#f87171",
                        fontSize: 13,
                        fontFamily: "var(--font-dm-mono), monospace",
                      }}
                    >
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features strip */}
      <section style={{ background: "#EFF6FF", borderBottom: "1px solid #E2E8F0" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-around py-3 gap-x-6 gap-y-2">
            {[
              "✓  Salary sacrifice",
              "✓  PA taper & 60% rate",
              "✓  5 student loan plans",
              "✓  Scottish bands",
              "✓  Mock payslip",
              "✓  Gift Aid",
            ].map((f) => (
              <span
                key={f}
                style={{
                  color: "#0F3460",
                  fontSize: 13,
                  fontFamily: "var(--font-dm-sans), Arial, sans-serif",
                }}
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Articles section */}
      {articles.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2
            style={{
              fontSize: 26,
              fontWeight: 700,
              color: "#0F3460",
              textAlign: "center",
              marginBottom: 6,
              fontFamily: "var(--font-dm-sans), Arial, sans-serif",
            }}
          >
            Understand your pay
          </h2>
          <p
            style={{
              color: "#64748B",
              textAlign: "center",
              fontSize: 15,
              marginBottom: 32,
            }}
          >
            Plain-English guides to the UK tax rules that affect your take-home pay
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/articles/${article.slug}`}
                style={{
                  display: "block",
                  background: "#ffffff",
                  border: "1px solid #E2E8F0",
                  borderRadius: 10,
                  overflow: "hidden",
                  borderTop: "3px solid #3B82F6",
                  transition: "box-shadow 0.2s",
                }}
                className="hover:shadow-md"
              >
                <div style={{ padding: "20px 24px" }}>
                  <p
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.1em",
                      color: "#3B82F6",
                      textTransform: "uppercase",
                      marginBottom: 8,
                      fontFamily: "var(--font-dm-sans), Arial, sans-serif",
                    }}
                  >
                    {article.category}
                  </p>
                  <h3
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: "#0F3460",
                      marginBottom: 8,
                      lineHeight: 1.4,
                      fontFamily: "var(--font-dm-sans), Arial, sans-serif",
                    }}
                  >
                    {article.title}
                  </h3>
                  <p
                    style={{ fontSize: 13, color: "#64748B", lineHeight: 1.6, marginBottom: 16 }}
                  >
                    {article.description}
                  </p>
                  <div
                    style={{ borderTop: "1px solid #E2E8F0", paddingTop: 12 }}
                    className="flex justify-between"
                  >
                    <span style={{ fontSize: 11, color: "#94a3b8" }}>{article.readTime}</span>
                    <span style={{ fontSize: 11, color: "#3B82F6" }}>Read →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/articles"
              style={{
                color: "#3B82F6",
                fontSize: 14,
                fontWeight: 500,
                fontFamily: "var(--font-dm-sans), Arial, sans-serif",
              }}
            >
              View all articles →
            </Link>
          </div>
        </section>
      )}

      {/* Download CTA strip */}
      <section style={{ background: "#0F3460" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#ffffff",
                  marginBottom: 4,
                  fontFamily: "var(--font-dm-sans), Arial, sans-serif",
                }}
              >
                Excel Calculator — Download
              </h2>
              <p style={{ color: "#93C5FD", fontSize: 14 }}>
                Save inputs · Model scenarios · Mock payslip · 2026/27 rates
              </p>
            </div>
            <Link
              href="/download"
              style={{
                background: "#FF00FF",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: 14,
                padding: "13px 28px",
                borderRadius: 24,
                fontFamily: "var(--font-dm-sans), Arial, sans-serif",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
              className="hover:opacity-90 transition-opacity inline-block"
            >
              Download — £9.99
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
