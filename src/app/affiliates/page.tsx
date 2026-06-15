import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Affiliates",
  description:
    "FCA-authorised UK investment platforms — SIPPs, Stocks & Shares ISAs. WageLab affiliate partners.",
  alternates: { canonical: "https://www.wagelab.co.uk/affiliates" },
};

const sipps = [
  { name: "Hargreaves Lansdown", desc: "UK's largest direct-to-investor platform" },
  { name: "Fidelity", desc: "Low-cost funds and pension products" },
  { name: "Interactive Investor", desc: "Flat-fee SIPP with broad investment choice" },
  { name: "AJ Bell", desc: "Online platform with competitive charges" },
  { name: "PensionBee", desc: "Simple pension consolidation and management" },
];

const isas = [
  { name: "Hargreaves Lansdown", desc: "UK's largest direct-to-investor platform" },
  { name: "Fidelity", desc: "Low-cost funds and ISA wrapper" },
  { name: "Interactive Investor", desc: "Flat-fee ISA with broad investment choice" },
];

function ProviderCard({ name, desc }: { name: string; desc: string }) {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #E2E8F0",
        borderRadius: 10,
        padding: "20px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        flexWrap: "wrap",
      }}
    >
      <div>
        <p
          style={{
            fontWeight: 700,
            color: "#0F3460",
            fontSize: 15,
            marginBottom: 4,
            fontFamily: "var(--font-dm-sans), Arial, sans-serif",
          }}
        >
          {name}
        </p>
        <p style={{ color: "#64748B", fontSize: 13, lineHeight: 1.5 }}>{desc}</p>
      </div>
      <a
        href="#"
        target="_blank"
        rel="noopener noreferrer sponsored"
        style={{
          background: "#FF00FF",
          color: "#ffffff",
          fontWeight: 700,
          fontSize: 13,
          padding: "9px 20px",
          borderRadius: 20,
          whiteSpace: "nowrap",
          fontFamily: "var(--font-dm-sans), Arial, sans-serif",
          flexShrink: 0,
        }}
      >
        Open account →
      </a>
    </div>
  );
}

export default function AffiliatesPage() {
  return (
    <div style={{ background: "#F8FAFF", minHeight: "100vh" }}>
      {/* Hero */}
      <div style={{ background: "#0F3460", padding: "48px 24px 40px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <p
            style={{
              fontSize: 11,
              letterSpacing: "0.1em",
              color: "#FF00FF",
              textTransform: "uppercase",
              marginBottom: 10,
              fontFamily: "var(--font-dm-sans), Arial, sans-serif",
              fontWeight: 600,
            }}
          >
            Partners
          </p>
          <h1
            style={{
              fontSize: 34,
              fontWeight: 700,
              color: "#ffffff",
              lineHeight: 1.25,
              marginBottom: 14,
              fontFamily: "var(--font-dm-sans), Arial, sans-serif",
            }}
          >
            Our affiliate partners
          </h1>
          <p
            style={{
              color: "#93C5FD",
              fontSize: 15,
              lineHeight: 1.7,
              maxWidth: 620,
            }}
          >
            FCA-authorised providers available to UK investors.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "32px 24px 64px" }}>
        {/* Disclosure banner */}
        <div
          style={{
            background: "#FFF7ED",
            border: "1px solid #FED7AA",
            borderRadius: 10,
            padding: "16px 20px",
            marginBottom: 36,
          }}
        >
          <p style={{ color: "#92400E", fontSize: 13, lineHeight: 1.6 }}>
            <strong>Disclosure:</strong> WageLab may earn a commission if you open an account via
            the links on this page. This does not affect the cost to you. When you invest, your
            capital is at risk and you may get back less than you invest. Tax treatment depends on
            individual circumstances and may change. This page is for information only and does not
            constitute a personal recommendation. WageLab is not FCA regulated.
          </p>
        </div>

        {/* Placeholder for logos */}
        <div
          style={{
            background: "#F1F5F9",
            border: "1px dashed #CBD5E1",
            borderRadius: 10,
            padding: "24px",
            textAlign: "center",
            marginBottom: 40,
          }}
        >
          <p style={{ color: "#64748B", fontSize: 13 }}>
            Provider logos — sourced from affiliate network creative libraries once approved
          </p>
        </div>

        {/* SIPPs section */}
        <section style={{ marginBottom: 40 }}>
          <h2
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "#0F3460",
              marginBottom: 8,
              fontFamily: "var(--font-dm-sans), Arial, sans-serif",
            }}
          >
            SIPPs — Self-Invested Personal Pensions
          </h2>
          <p
            style={{
              color: "#64748B",
              fontSize: 14,
              lineHeight: 1.7,
              marginBottom: 20,
            }}
          >
            A SIPP lets you choose your own investments within a pension wrapper. Contributions
            attract tax relief at your marginal rate. If you&apos;re considering increasing your pension
            contributions — particularly if you&apos;re near the £100,000 Adjusted Net Income threshold —
            a SIPP may be worth exploring.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {sipps.map((p) => (
              <ProviderCard key={p.name} name={p.name} desc={p.desc} />
            ))}
          </div>
        </section>

        {/* ISAs section */}
        <section style={{ marginBottom: 48 }}>
          <h2
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "#0F3460",
              marginBottom: 8,
              fontFamily: "var(--font-dm-sans), Arial, sans-serif",
            }}
          >
            Stocks &amp; Shares ISAs
          </h2>
          <p
            style={{
              color: "#64748B",
              fontSize: 14,
              lineHeight: 1.7,
              marginBottom: 20,
            }}
          >
            An ISA lets your investments grow free of Income Tax and Capital Gains Tax. Withdrawals
            are also tax-free. The annual ISA allowance is £20,000 in 2026/27.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {isas.map((p) => (
              <ProviderCard key={p.name} name={p.name} desc={p.desc} />
            ))}
          </div>
        </section>

        {/* Capital at risk warning */}
        <div
          style={{
            background: "#F8FAFF",
            border: "1px solid #E2E8F0",
            borderRadius: 10,
            padding: "16px 20px",
            marginBottom: 24,
          }}
        >
          <p style={{ color: "#64748B", fontSize: 12, lineHeight: 1.7 }}>
            <strong style={{ color: "#334155" }}>Capital at risk.</strong> The value of investments
            can fall as well as rise. You may get back less than you invest. Past performance is not
            a guide to future performance. Tax treatment depends on individual circumstances and may
            change. These links are for information only and are not a personal recommendation. Seek
            independent financial advice from an FCA-authorised adviser before making any investment
            or pension decision. WageLab is not FCA regulated and does not provide financial advice.
          </p>
        </div>

        <div style={{ borderTop: "1px solid #E2E8F0", paddingTop: 20 }}>
          <Link href="/" style={{ color: "#3B82F6", fontSize: 13, fontWeight: 500 }}>
            ← Back to WageLab
          </Link>
        </div>
      </div>
    </div>
  );
}
