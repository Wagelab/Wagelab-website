import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with WageLab. For general enquiries, press, partnerships, or to report a calculator error.",
  alternates: { canonical: "https://www.wagelab.co.uk/contact" },
};

const enquiries = [
  { label: "Press & media", email: "hello@wagelab.co.uk" },
  { label: "Partnerships & affiliates", email: "hello@wagelab.co.uk" },
  {
    label: "Technical issues",
    email: "hello@wagelab.co.uk",
    note: "Include your browser and device type",
  },
  { label: "Data protection & privacy", email: "hello@wagelab.co.uk" },
];

export default function ContactPage() {
  return (
    <>
      {/* Header */}
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
            Contact
          </h1>
          <p style={{ color: "#93C5FD", fontSize: 14 }}>
            We aim to respond within 2–3 working days.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Get in touch */}
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
            Get in touch
          </h2>
          <p style={{ fontSize: 14, color: "#334155", lineHeight: 1.7, marginBottom: 8 }}>
            For general enquiries about the WageLab calculator or website, email
            us at{" "}
            <a href="mailto:hello@wagelab.co.uk" style={{ color: "#3B82F6" }}>
              hello@wagelab.co.uk
            </a>
            .
          </p>
          <p style={{ fontSize: 14, color: "#64748B" }}>
            We aim to respond within 2–3 working days.
          </p>
        </div>

        {/* Specific enquiries */}
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #E2E8F0",
            borderRadius: 8,
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
            Specific enquiries
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {enquiries.map(({ label, email, note }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  padding: "12px 16px",
                  background: "#F8FAFF",
                  border: "1px solid #E2E8F0",
                  borderRadius: 6,
                }}
              >
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#0F3460",
                    fontFamily: "var(--font-dm-sans), Arial, sans-serif",
                  }}
                >
                  {label}
                </span>
                <a href={`mailto:${email}`} style={{ fontSize: 13, color: "#3B82F6" }}>
                  {email}
                </a>
                {note && (
                  <span style={{ fontSize: 12, color: "#94A3B8", fontStyle: "italic" }}>
                    {note}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Corrections */}
        <div
          style={{
            background: "#FFFBEB",
            border: "1px solid #FDE68A",
            borderRadius: 8,
            padding: "20px 24px",
            marginBottom: 24,
          }}
        >
          <h2
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "#92400E",
              marginBottom: 8,
              fontFamily: "var(--font-dm-sans), Arial, sans-serif",
            }}
          >
            Corrections
          </h2>
          <p style={{ fontSize: 13, color: "#78350F", lineHeight: 1.7 }}>
            If you believe there is an error in the calculator or in any article
            on this site, please let us know at{" "}
            <a href="mailto:hello@wagelab.co.uk" style={{ color: "#B45309" }}>
              hello@wagelab.co.uk
            </a>{" "}
            with as much detail as possible. We take accuracy seriously and will
            investigate all reports promptly.
          </p>
        </div>

        {/* CTA */}
        <div
          style={{
            background: "#EFF6FF",
            border: "1px solid #BFDBFE",
            borderRadius: 8,
            padding: "20px 24px",
          }}
        >
          <p style={{ fontSize: 14, color: "#334155", marginBottom: 4 }}>
            Have a tax calculation question?{" "}
            <Link href="/faq" style={{ color: "#3B82F6" }}>
              Check the FAQ
            </Link>{" "}
            — it covers the most common queries about pensions, student loans, and
            how the calculator works.
          </p>
          <p style={{ fontSize: 13, color: "#64748B" }}>
            Or{" "}
            <Link href="/calculator" style={{ color: "#3B82F6" }}>
              try the calculator
            </Link>{" "}
            to see your own take-home pay figures.
          </p>
        </div>
      </div>
    </>
  );
}
