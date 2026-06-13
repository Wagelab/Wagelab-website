import Link from "next/link";

const navLinks = [
  { href: "/calculator", label: "Calculator" },
  { href: "/articles", label: "Articles" },
  { href: "/download", label: "Download" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/cookie-policy", label: "Cookie Policy" },
  { href: "/terms-of-use", label: "Terms of Use" },
];

export default function Footer() {
  const showAdsense = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true";

  return (
    <footer style={{ background: "#0F3460" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Nav links */}
        <nav
          className="flex flex-wrap justify-center gap-x-4 gap-y-2 pb-6"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                color: "#93C5FD",
                fontSize: 13,
                fontFamily: "var(--font-dm-sans), Arial, sans-serif",
              }}
              className="hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Copyright */}
        <p
          className="text-center mt-6 mb-6"
          style={{ color: "#93C5FD", fontSize: 13 }}
        >
          © WageLab {new Date().getFullYear()}. All rights reserved.{" "}
          <span style={{ opacity: 0.6 }}>|</span> wagelab.co.uk
        </p>

        {/* Affiliate disclosure */}
        <p
          className="text-center mb-4 max-w-4xl mx-auto"
          style={{ color: "#64748B", fontSize: 12, lineHeight: 1.6 }}
        >
          WageLab may earn a commission if you open an account with a provider
          through links on this site. This does not affect the price you pay.
          Affiliate links are clearly identified. WageLab does not compare,
          rank, or recommend providers.
        </p>

        {/* FCA compliance — legally required on every page */}
        <p
          className="text-center mb-4 max-w-4xl mx-auto"
          style={{ color: "#93C5FD", fontSize: 11, lineHeight: 1.7 }}
        >
          WageLab is not regulated by the Financial Conduct Authority (FCA) and
          does not provide financial advice, tax advice, or personal
          recommendations of any kind. The calculator and all content on this
          site are for informational and illustrative purposes only. Results are
          estimates based on 2026/27 HMRC rates and may not reflect your actual
          tax position. Tax rules are subject to change. Always seek independent
          advice from a suitably qualified and FCA-authorised financial adviser
          before making any financial decision.
        </p>

        {/* Google AdSense disclosure — conditional */}
        {showAdsense && (
          <p
            className="text-center max-w-4xl mx-auto"
            style={{ color: "#64748B", fontSize: 11, lineHeight: 1.7 }}
          >
            This site may display advertisements served by Google AdSense.
            Advertisements are clearly labelled. WageLab does not endorse
            advertised products or services. To opt out of personalised
            advertising visit{" "}
            <a
              href="https://adssettings.google.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#93C5FD" }}
            >
              adssettings.google.com
            </a>
            .
          </p>
        )}
      </div>
    </footer>
  );
}
