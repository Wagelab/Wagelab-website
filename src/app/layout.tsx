import type { Metadata } from "next";
import { DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.wagelab.co.uk"),
  title: {
    default: "WageLab – UK Take-Home Pay Calculator 2026/27",
    template: "%s – WageLab",
  },
  description:
    "Free UK take-home pay calculator for 2026/27. Salary sacrifice, pension, dividends, student loans, Scottish tax — all in one place.",
  keywords: [
    "UK tax calculator",
    "take-home pay",
    "salary calculator",
    "2026/27",
    "PAYE",
    "NI calculator",
  ],
  authors: [{ name: "WageLab", url: "https://www.wagelab.co.uk" }],
  creator: "WageLab",
  publisher: "WageLab",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://www.wagelab.co.uk",
    siteName: "WageLab",
    title: "WageLab – UK Take-Home Pay Calculator 2026/27",
    description:
      "Free UK take-home pay calculator. Salary, pension, dividends, student loans, all in one place.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "WageLab UK Tax Calculator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WageLab – UK Take-Home Pay Calculator 2026/27",
    description:
      "Free UK take-home pay calculator. Salary, pension, dividends, student loans.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-GB"
      className={`${dmSans.variable} ${dmMono.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-site-bg text-body font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
