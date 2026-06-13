import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you were looking for could not be found.",
};

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <p
          style={{
            fontSize: 80,
            fontWeight: 900,
            color: "#FF00FF",
            lineHeight: 1,
            fontFamily: "var(--font-dm-mono), monospace",
          }}
        >
          404
        </p>
        <h1
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: "#0F3460",
            marginBottom: 12,
            fontFamily: "var(--font-dm-sans), Arial, sans-serif",
          }}
        >
          Page not found
        </h1>
        <p style={{ color: "#64748B", fontSize: 15, marginBottom: 24 }}>
          The page you were looking for doesn't exist.
        </p>
        <Link
          href="/"
          style={{
            background: "#FF00FF",
            color: "#ffffff",
            fontWeight: 700,
            fontSize: 14,
            padding: "10px 24px",
            borderRadius: 20,
            fontFamily: "var(--font-dm-sans), Arial, sans-serif",
            display: "inline-block",
          }}
        >
          Go to homepage
        </Link>
      </div>
    </div>
  );
}
