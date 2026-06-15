"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { href: "/calculator", label: "Calculator" },
  { href: "/articles", label: "Articles" },
  { href: "/affiliates", label: "Affiliates" },
  { href: "/download", label: "Download" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header style={{ background: "#0F3460" }} className="sticky top-0 z-50">
      {/* Top magenta accent line */}
      <div style={{ height: 3, background: "#FF00FF" }} />

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <Image
              src="/wagelab-logo.svg"
              alt="WageLab"
              width={160}
              height={37}
              priority
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    color: isActive ? "#ffffff" : "#93C5FD",
                    fontWeight: isActive ? 600 : 400,
                    fontSize: 13,
                    padding: "6px 12px",
                    borderRadius: 6,
                    background: isActive ? "rgba(255,255,255,0.08)" : "transparent",
                    transition: "all 0.15s",
                    fontFamily: "var(--font-dm-sans), Arial, sans-serif",
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* CTA button */}
          <div className="hidden md:flex items-center">
            <Link
              href="/download"
              style={{
                background: "#FF00FF",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: 12,
                padding: "8px 18px",
                borderRadius: 20,
                fontFamily: "var(--font-dm-sans), Arial, sans-serif",
                whiteSpace: "nowrap",
                transition: "opacity 0.15s",
              }}
              className="hover:opacity-90"
            >
              Download — £9.99
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
          >
            <span
              style={{
                display: "block",
                width: 22,
                height: 2,
                background: "#ffffff",
                borderRadius: 1,
                transition: "all 0.2s",
                transform: mobileOpen ? "rotate(45deg) translate(5px, 5px)" : "none",
              }}
            />
            <span
              style={{
                display: "block",
                width: 22,
                height: 2,
                background: "#ffffff",
                borderRadius: 1,
                opacity: mobileOpen ? 0 : 1,
                transition: "all 0.2s",
              }}
            />
            <span
              style={{
                display: "block",
                width: 22,
                height: 2,
                background: "#ffffff",
                borderRadius: 1,
                transition: "all 0.2s",
                transform: mobileOpen ? "rotate(-45deg) translate(5px, -5px)" : "none",
              }}
            />
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div
            style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
            className="md:hidden py-3 pb-4"
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: "block",
                    color: isActive ? "#ffffff" : "#93C5FD",
                    fontWeight: isActive ? 600 : 400,
                    fontSize: 15,
                    padding: "10px 4px",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    fontFamily: "var(--font-dm-sans), Arial, sans-serif",
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/download"
              onClick={() => setMobileOpen(false)}
              style={{
                display: "inline-block",
                marginTop: 12,
                background: "#FF00FF",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: 13,
                padding: "10px 20px",
                borderRadius: 20,
                fontFamily: "var(--font-dm-sans), Arial, sans-serif",
              }}
            >
              Download — £9.99
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
