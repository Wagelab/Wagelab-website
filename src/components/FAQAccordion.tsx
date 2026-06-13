"use client";

import { useState } from "react";

interface FAQItem {
  q: string;
  a: string;
}

interface FAQSection {
  heading: string;
  items: FAQItem[];
}

function FAQItemRow({ q, a }: FAQItem) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid #E2E8F0" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          padding: "16px 0",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          gap: 12,
        }}
        aria-expanded={open}
      >
        <span
          style={{
            fontSize: 15,
            fontWeight: 500,
            color: "#0F3460",
            lineHeight: 1.4,
            fontFamily: "var(--font-dm-sans), Arial, sans-serif",
          }}
        >
          {q}
        </span>
        <span
          style={{
            flexShrink: 0,
            color: "#FF00FF",
            fontSize: 22,
            fontWeight: 300,
            transition: "transform 0.2s",
            display: "inline-block",
            transform: open ? "rotate(45deg)" : "none",
          }}
        >
          +
        </span>
      </button>
      {open && (
        <p
          style={{
            fontSize: 14,
            color: "#64748B",
            lineHeight: 1.7,
            paddingBottom: 16,
          }}
        >
          {a}
        </p>
      )}
    </div>
  );
}

export default function FAQAccordion({ sections }: { sections: FAQSection[] }) {
  return (
    <>
      {sections.map((section) => (
        <div key={section.heading} className="mb-10">
          <h2
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "#0F3460",
              marginBottom: 16,
              paddingBottom: 8,
              borderBottom: "2px solid #0F3460",
              fontFamily: "var(--font-dm-sans), Arial, sans-serif",
            }}
          >
            {section.heading}
          </h2>
          {section.items.map((item) => (
            <FAQItemRow key={item.q} q={item.q} a={item.a} />
          ))}
        </div>
      ))}
    </>
  );
}
