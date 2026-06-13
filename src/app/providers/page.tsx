import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pension & Investment Providers",
  description:
    "Compare UK SIPP and Stocks & Shares ISA providers. Affiliate disclosure: WageLab may earn a commission from provider links.",
  alternates: { canonical: "https://www.wagelab.co.uk/providers" },
};

const sipps = [
  {
    name: "Hargreaves Lansdown",
    note: "UK's largest direct-to-investor platform",
    href: "#",
  },
  { name: "Fidelity", note: "Low-cost funds & managed portfolios", href: "#" },
  { name: "Interactive Investor", note: "Flat-fee pricing for larger pots", href: "#" },
  { name: "AJ Bell", note: "Low charges, wide investment choice", href: "#" },
  { name: "PensionBee", note: "Consolidate old pensions simply", href: "#" },
];

const isas = [
  { name: "Hargreaves Lansdown", note: "Stocks & Shares ISA", href: "#" },
  { name: "Fidelity", note: "Stocks & Shares ISA", href: "#" },
  { name: "Interactive Investor", note: "Stocks & Shares ISA", href: "#" },
];

function ProviderCard({
  name,
  note,
  href,
}: {
  name: string;
  note: string;
  href: string;
}) {
  return (
    <a
      href={href}
      rel="nofollow noopener sponsored"
      target="_blank"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "14px 16px",
        background: "#F8FAFF",
        border: "1px solid #E2E8F0",
        borderRadius: 6,
        textDecoration: "none",
        gap: 12,
      }}
    >
      <div>
        <p
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "#0F3460",
            fontFamily: "var(--font-dm-sans), Arial, sans-serif",
            marginBottom: 2,
          }}
        >
          {name}
        </p>
        <p style={{ fontSize: 12, color: "#64748B" }}>{note}</p>
      </div>
      <span
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: "#3B82F6",
          flexShrink: 0,
        }}
      >
        Open account →
      </span>
    </a>
  );
}

export default function ProvidersPage() {
  return (
    <>
      {/* Header */}
      <section style={{ background: "#0F3460" }} className="py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "#ffffff",
              marginBottom: 8,
              fontFamily: "var(--font-dm-sans), Arial, sans-serif",
            }}
          >
            Pension &amp; Investment Providers
          </h1>
          <p style={{ color: "#93C5FD", fontSize: 14 }}>
            Affiliate partners — providers available to UK investors.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Affiliate disclosure */}
        <div
          style={{
            background: "#FFF7ED",
            border: "1px solid #FED7AA",
            borderRadius: 8,
            padding: "14px 18px",
            marginBottom: 28,
            fontSize: 13,
            color: "#92400E",
            lineHeight: 1.6,
          }}
        >
          <strong>Affiliate disclosure:</strong> WageLab may earn a commission
          if you open an account with a provider through links on this page.
          This does not affect the price you pay. WageLab does not compare,
          rank, or recommend providers. These links are provided for convenience
          only. Please read each provider&apos;s own documentation before opening
          an account.
        </div>

        {/* Opening an account */}
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #E2E8F0",
            borderRadius: 8,
            borderTop: "4px solid #FF00FF",
            padding: "24px 28px",
            marginBottom: 28,
          }}
        >
          <h2
            style={{
              fontSize: 17,
              fontWeight: 700,
              color: "#0F3460",
              marginBottom: 10,
              fontFamily: "var(--font-dm-sans), Arial, sans-serif",
            }}
          >
            Opening an account with an affiliate
          </h2>
          <p style={{ fontSize: 14, color: "#334155", lineHeight: 1.7 }}>
            The WageLab calculator shows you what your pension contributions
            cost and what you save in tax. If you&apos;re thinking about where to
            invest, the providers below are well-established UK platforms. We
            may earn a commission if you open an account through these links —
            this does not affect the price you pay.
          </p>
        </div>

        {/* SIPPs */}
        <div style={{ marginBottom: 32 }}>
          <h2
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "#0F3460",
              marginBottom: 8,
              fontFamily: "var(--font-dm-sans), Arial, sans-serif",
            }}
          >
            SIPPs — Self-Invested Personal Pensions
          </h2>
          <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.7, marginBottom: 16 }}>
            A SIPP lets you choose your own investments within a pension wrapper.
            Contributions attract tax relief at your marginal rate. If you&apos;re
            considering increasing your pension contributions — particularly if
            you&apos;re near the £100,000 Adjusted Net Income threshold — a SIPP may
            be worth exploring.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {sipps.map((p) => (
              <ProviderCard key={p.name + "-sipp"} {...p} />
            ))}
          </div>
        </div>

        {/* ISAs */}
        <div style={{ marginBottom: 32 }}>
          <h2
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "#0F3460",
              marginBottom: 8,
              fontFamily: "var(--font-dm-sans), Arial, sans-serif",
            }}
          >
            Stocks &amp; Shares ISAs
          </h2>
          <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.7, marginBottom: 16 }}>
            An ISA lets your investments grow free of Income Tax and Capital
            Gains Tax. Withdrawals are also tax-free. The annual ISA allowance
            is £20,000 in 2026/27.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {isas.map((p) => (
              <ProviderCard key={p.name + "-isa"} {...p} />
            ))}
          </div>
        </div>

        {/* FCA disclaimer */}
        <div
          style={{
            background: "#FFFBEB",
            border: "1px solid #FDE68A",
            borderRadius: 8,
            padding: "16px 20px",
            marginBottom: 24,
          }}
        >
          <p style={{ fontSize: 12, color: "#92400E", lineHeight: 1.6 }}>
            <strong>Not financial advice.</strong> WageLab is not FCA regulated
            and does not provide financial advice or personal recommendations.
            The providers listed here are provided for informational purposes
            only. Please seek independent advice from an FCA-authorised financial
            adviser before making any investment decision.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/calculator"
            style={{
              background: "#FF00FF",
              color: "#ffffff",
              fontWeight: 700,
              fontSize: 14,
              padding: "12px 28px",
              borderRadius: 24,
              display: "inline-block",
              fontFamily: "var(--font-dm-sans), Arial, sans-serif",
            }}
            className="hover:opacity-90 transition-opacity"
          >
            Model your pension contributions →
          </Link>
        </div>
      </div>
    </>
  );
}
