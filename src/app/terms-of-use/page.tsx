import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "WageLab terms of use — the rules for using this site.",
  alternates: { canonical: "https://www.wagelab.co.uk/terms-of-use" },
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
};

export default function TermsOfUsePage() {
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
            Terms of Use
          </h1>
          <p style={{ color: "#93C5FD", fontSize: 14 }}>
            Last updated: June 2026. Please read these terms carefully before using WageLab.
          </p>
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
          <h2 style={{ ...s.h2, marginTop: 0 }}>1. Acceptance of terms</h2>
          <p style={s.p}>
            By accessing and using the WageLab website at wagelab.co.uk (the &ldquo;Site&rdquo;),
            you agree to be bound by these Terms of Use. If you do not agree, please do
            not use the Site.
          </p>

          <h2 style={s.h2}>2. Nature of the service</h2>
          <p style={s.p}>
            WageLab provides a free online tool for estimating UK take-home pay and related
            tax calculations. The Site also provides articles and information about UK
            taxation, pensions, salary sacrifice, and related topics.
          </p>
          <p style={s.p}>
            The calculator and all content on this Site are provided for informational and
            illustrative purposes only. They do not constitute financial, tax, investment,
            pension, or legal advice of any kind.
          </p>

          <h2 style={s.h2}>3. Accuracy of calculations</h2>
          <p style={s.p}>
            WageLab uses HMRC&apos;s published rates and thresholds for the 2026/27 tax year.
            Calculations are estimates only. Actual tax, National Insurance, and other
            deductions on your payslip may differ due to:
          </p>
          <ul style={{ paddingLeft: 20, marginBottom: 12 }}>
            {[
              "Your employer's specific payroll arrangements",
              "Benefits in kind not entered into the calculator",
              "Previous periods of over or under payment being corrected through cumulative PAYE",
              "Changes to HMRC rates or thresholds not yet reflected in the calculator",
              "Errors in the information you enter",
            ].map((item) => (
              <li key={item} style={s.li}>
                {item}
              </li>
            ))}
          </ul>
          <p style={s.p}>
            You should not rely on WageLab&apos;s output as a definitive statement of your tax
            liability. Always refer to your actual payslip and, where necessary, consult
            HMRC or a qualified professional.
          </p>

          <h2 style={s.h2}>4. No financial advice</h2>
          <p style={s.p}>
            Nothing on this Site constitutes regulated financial advice or a personal
            recommendation. WageLab is not authorised or regulated by the Financial Conduct
            Authority (FCA). The content on this Site, including all articles, is for
            informational purposes only.
          </p>
          <p style={s.p}>
            Before making any financial decision — including decisions about pension
            contributions, salary sacrifice arrangements, investments, or tax planning —
            you should seek independent advice from a suitably qualified and FCA-authorised
            financial adviser.
          </p>

          <h2 style={s.h2}>5. Affiliate links and third-party providers</h2>
          <p style={s.p}>
            This Site contains links to third-party financial services websites. WageLab
            may earn a commission if you open an account or take out a product through
            these links. This does not affect the price you pay.
          </p>
          <p style={s.p}>
            The inclusion of a link to a third-party provider does not constitute an
            endorsement, recommendation, or guarantee of that provider&apos;s products or
            services. WageLab has no responsibility for the accuracy of third-party
            content.
          </p>
          <p style={s.p}>
            When you invest, your capital is at risk. The value of investments can fall as
            well as rise. Past performance is not a guide to future performance.
          </p>

          <h2 style={s.h2}>6. Intellectual property</h2>
          <p style={s.p}>
            All content on this Site — including but not limited to the calculator,
            articles, design, text, graphics, and code — is the property of WageLab and
            is protected by UK copyright law and other intellectual property laws.
          </p>
          <p style={s.p}>
            You may not copy, reproduce, republish, distribute, or create derivative works
            from any content on this Site without our prior written permission, except for
            personal, non-commercial use.
          </p>

          <h2 style={s.h2}>7. Limitation of liability</h2>
          <p style={s.p}>
            To the fullest extent permitted by law, WageLab excludes all liability for:
          </p>
          <ul style={{ paddingLeft: 20, marginBottom: 12 }}>
            {[
              "Any inaccuracies in calculator outputs or article content",
              "Any loss or damage arising from your reliance on information provided on this Site",
              "Any interruption, suspension, or termination of the Site",
              "Any loss or damage arising from links to third-party websites",
            ].map((item) => (
              <li key={item} style={s.li}>
                {item}
              </li>
            ))}
          </ul>
          <p style={s.p}>
            Nothing in these Terms limits WageLab&apos;s liability for death or personal injury
            caused by negligence, or for fraud or fraudulent misrepresentation.
          </p>

          <h2 style={s.h2}>8. Availability</h2>
          <p style={s.p}>
            We aim to keep WageLab available at all times but do not guarantee uninterrupted
            access. WageLab is not FCA regulated. Nothing on this Site constitutes a
            financial promotion, personal recommendation, or regulated activity.
          </p>

          <h2 style={s.h2}>9. Governing law</h2>
          <p style={s.p}>
            These Terms of Use are governed by the laws of England and Wales. Any disputes
            arising from your use of the Site will be subject to the exclusive jurisdiction
            of the courts of England and Wales.
          </p>

          <h2 style={s.h2}>10. Changes to these terms</h2>
          <p style={s.p}>
            We may update these Terms of Use at any time. The date at the top of this page
            shows when they were last revised. Continued use of the Site after any update
            constitutes acceptance of the revised terms.
          </p>

          <h2 style={s.h2}>11. Contact</h2>
          <p style={s.p}>
            For questions about these Terms, please contact us at{" "}
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
