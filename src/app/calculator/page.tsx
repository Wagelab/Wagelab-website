import type { Metadata } from "next";
import Calculator from "@/components/Calculator";

export const metadata: Metadata = {
  title: "UK Take-Home Pay Calculator 2026/27",
  description:
    "Calculate your UK take-home pay for 2026/27. Covers salary sacrifice, pension, dividends, student loans, Scottish bands, and more.",
  alternates: { canonical: "https://www.wagelab.co.uk/calculator" },
};

export default function CalculatorPage() {
  return <Calculator />;
}
