import type { Metadata } from "next";
import Link from "next/link";
import FAQAccordion from "@/components/FAQAccordion";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Common questions about the WageLab calculator, UK take-home pay, pensions, student loans, and more.",
  alternates: { canonical: "https://www.wagelab.co.uk/faq" },
};

const faqSections = [
  {
    heading: "About the calculator",
    items: [
      {
        q: "How accurate is the WageLab calculator?",
        a: "WageLab uses HMRC's published rates and thresholds for 2026/27 and applies the correct calculation methodology for each element — including the monthly floor method for student loan repayments, the correct treatment of Relief at Source pensions for Adjusted Net Income, and all six Scottish Income Tax bands. Results are estimates. Your actual payslip may differ slightly due to cumulative PAYE adjustments, rounding, or employer-specific arrangements.",
      },
      {
        q: "Is the calculator free?",
        a: "Yes. The online calculator at wagelab.co.uk is completely free to use. There is no sign-up, no account, and no charge. The downloadable Excel version is available separately for £9.99.",
      },
      {
        q: "Does WageLab store my data?",
        a: "No. All calculations happen in your browser. No data you enter is transmitted to any server or stored anywhere. We have no access to the figures you enter.",
      },
      {
        q: "What tax year does the calculator use?",
        a: "The calculator uses 2026/27 HMRC rates, which apply from 6 April 2026 to 5 April 2027. We update the calculator each April when HMRC publishes new rates.",
      },
      {
        q: "Can I use it for previous tax years?",
        a: "The online calculator is set to 2026/27. For previous years, rates and thresholds differ — using the current calculator for a previous year will not give accurate results. The downloadable Excel version contains the Tax Bands & Rates sheet showing all current thresholds.",
      },
    ],
  },
  {
    heading: "Income Tax",
    items: [
      {
        q: "Why does my effective tax rate seem high?",
        a: "If your income is between £100,000 and £125,140, you may be in the Personal Allowance taper zone where the effective marginal rate is 60%. This is not an error — it is the mathematical consequence of losing £1 of tax-free Personal Allowance for every £2 earned above £100,000. See our article on the £100,000 income trap for a full explanation.",
      },
      {
        q: "What is the difference between the England and Scotland calculations?",
        a: "Scotland has its own Income Tax rates set by the Scottish Government, with six bands compared to three in England, Wales, and Northern Ireland. The Scottish higher rate of 42% kicks in at £43,663 compared to £50,271 in England. Select your region in the calculator to apply the correct rates.",
      },
      {
        q: "Why is my tax code important?",
        a: "Your tax code determines how much Personal Allowance you receive and at what rate your income is taxed. A code of 1257L means the standard £12,570 allowance. BR means all income is taxed at 20% with no allowance — common for second jobs. An incorrect tax code can mean paying too much or too little tax. Enter your exact code in the calculator to get accurate results.",
      },
    ],
  },
  {
    heading: "Pensions",
    items: [
      {
        q: "What is the difference between salary sacrifice and relief at source?",
        a: "Salary sacrifice reduces your contractual gross salary before tax and National Insurance are calculated. This saves both Income Tax and NI on the sacrificed amount. Relief at Source contributions come from your net pay; the pension provider claims 20% basic rate tax back from HMRC. Higher rate taxpayers can claim additional relief via Self Assessment. Relief at Source does not save NI.",
      },
      {
        q: "Why does my pension contribution change my Personal Allowance?",
        a: "Pension contributions via salary sacrifice or Net Pay Arrangement reduce your Adjusted Net Income (ANI). If your ANI falls below £100,000 as a result, your Personal Allowance is restored — saving up to £5,028 in tax. This is why the calculator shows your ANI alongside the results.",
      },
      {
        q: "What is Auto-Enrolment?",
        a: "Auto-Enrolment is the legal minimum pension contribution basis, where the percentage applies only to earnings between £6,240 and £50,270 (qualifying earnings). The Standard basis applies the percentage to your full gross salary. Most employer schemes use one or the other — check your scheme documentation.",
      },
    ],
  },
  {
    heading: "Student Loans",
    items: [
      {
        q: "Which student loan plan am I on?",
        a: "This depends on when and where you studied. Plan 1 covers English and Welsh students who started before September 2012, and all Northern Irish students. Plan 2 covers English and Welsh students who started between September 2012 and July 2023. Plan 4 covers Scottish students with SAAS loans. Plan 5 covers English students starting from August 2023. Postgraduate loans are Plan 3.",
      },
      {
        q: "Why is my student loan repayment different from what I calculated?",
        a: "The WageLab calculator uses HMRC's PAYE method: the monthly threshold is applied to your monthly salary, and the result is floored (rounded down to whole pounds). This can produce slightly different results from a simple annual calculation. The calculator accurately reflects how deductions appear on your payslip.",
      },
    ],
  },
  {
    heading: "The Excel download",
    items: [
      {
        q: "What does the Excel version include?",
        a: "The downloadable Excel calculator includes all the same functionality as the online version, plus the ability to save your inputs, model different scenarios, and use it offline. It includes a Tax Bands & Rates reference sheet with all 2026/27 HMRC thresholds, and a mock payslip view.",
      },
      {
        q: "Is the Excel version the same as the online calculator?",
        a: "Yes. Both use identical calculation logic and 2026/27 rates. The Excel version is cross-referenced and tested against the online calculator to ensure they produce the same results.",
      },
      {
        q: "Can I share the Excel file?",
        a: "The Excel file is licensed for personal use only. Please refer to the Licence Agreement tab within the file for full terms. Redistribution or resale is not permitted.",
      },
    ],
  },
  {
    heading: "General",
    items: [
      {
        q: "Is this financial advice?",
        a: "No. WageLab is an information and calculation tool. Nothing on this Site constitutes financial, tax, or investment advice. WageLab is not regulated by the Financial Conduct Authority and does not provide financial advice or personal recommendations. Please seek independent advice from a suitably qualified and FCA-authorised financial adviser for your personal circumstances.",
      },
      {
        q: "How do I contact WageLab?",
        a: "For general enquiries, please email hello@wagelab.co.uk. We aim to respond within 2–3 working days.",
      },
    ],
  },
];

export default function FAQPage() {
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
            Frequently Asked Questions
          </h1>
          <p style={{ color: "#93C5FD", fontSize: 14 }}>
            Common questions about the WageLab calculator and UK take-home pay.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <FAQAccordion sections={faqSections} />

        {/* CTA */}
        <div
          style={{
            background: "#EFF6FF",
            border: "1px solid #BFDBFE",
            borderRadius: 10,
            padding: "20px 24px",
            marginTop: 8,
          }}
        >
          <p
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: "#0F3460",
              marginBottom: 8,
              fontFamily: "var(--font-dm-sans), Arial, sans-serif",
            }}
          >
            Still have a question?
          </p>
          <p style={{ color: "#64748B", fontSize: 13 }}>
            Email us at{" "}
            <a href="mailto:hello@wagelab.co.uk" style={{ color: "#3B82F6" }}>
              hello@wagelab.co.uk
            </a>{" "}
            and we&apos;ll get back to you within 2–3 working days. Or{" "}
            <Link href="/calculator" style={{ color: "#3B82F6" }}>
              try the calculator
            </Link>{" "}
            to see the numbers for your own circumstances.
          </p>
        </div>
      </div>
    </>
  );
}
