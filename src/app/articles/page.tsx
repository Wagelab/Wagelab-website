import type { Metadata } from "next";
import Link from "next/link";
import { getAllArticles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "UK Tax & Pay Articles",
  description:
    "Plain-English guides to UK income tax, NI, pensions, student loans, salary sacrifice, and take-home pay. Updated for 2026/27.",
  alternates: { canonical: "https://www.wagelab.co.uk/articles" },
};

const categoryColors: Record<string, string> = {
  "Income Tax": "#3B82F6",
  Pensions: "#8B5CF6",
  "Student Loans": "#F59E0B",
  "Salary Sacrifice": "#10B981",
  General: "#64748B",
};

export default function ArticlesPage() {
  const articles = getAllArticles();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Page header */}
      <div className="mb-10">
        <h1
          style={{
            fontSize: 32,
            fontWeight: 700,
            color: "#0F3460",
            marginBottom: 8,
            fontFamily: "var(--font-dm-sans), Arial, sans-serif",
          }}
        >
          Articles
        </h1>
        <p style={{ color: "#64748B", fontSize: 16, lineHeight: 1.6 }}>
          Plain-English guides to UK income tax, pensions, student loans, and
          more — all written to help you understand and improve your take-home pay.
        </p>
      </div>

      {/* Articles grid */}
      {articles.length === 0 ? (
        <p style={{ color: "#64748B" }}>Articles coming soon.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => {
            const accentColor = categoryColors[article.category] || "#3B82F6";
            return (
              <Link
                key={article.slug}
                href={`/articles/${article.slug}`}
                style={{
                  display: "block",
                  background: "#ffffff",
                  border: "1px solid #E2E8F0",
                  borderRadius: 10,
                  overflow: "hidden",
                  borderTop: `3px solid ${accentColor}`,
                  transition: "box-shadow 0.2s",
                }}
                className="hover:shadow-md"
              >
                <div style={{ padding: "20px 24px" }}>
                  <p
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.1em",
                      color: accentColor,
                      textTransform: "uppercase",
                      marginBottom: 8,
                      fontFamily: "var(--font-dm-sans), Arial, sans-serif",
                      fontWeight: 600,
                    }}
                  >
                    {article.category}
                  </p>
                  <h2
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
                  </h2>
                  <p
                    style={{
                      fontSize: 13,
                      color: "#64748B",
                      lineHeight: 1.6,
                      marginBottom: 16,
                    }}
                  >
                    {article.description}
                  </p>
                  <div
                    style={{ borderTop: "1px solid #E2E8F0", paddingTop: 12 }}
                    className="flex justify-between items-center"
                  >
                    <span style={{ fontSize: 11, color: "#94a3b8" }}>
                      {article.readTime}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        color: accentColor,
                        fontWeight: 600,
                      }}
                    >
                      Read →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
