"use client";

import { useState } from "react";

export default function DownloadButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Checkout failed. Please try again.");
      }
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleCheckout}
        disabled={loading}
        style={{
          width: "100%",
          background: loading ? "#cc00cc" : "#FF00FF",
          color: "#ffffff",
          fontWeight: 700,
          fontSize: 15,
          padding: "14px 24px",
          borderRadius: 24,
          border: "none",
          cursor: loading ? "wait" : "pointer",
          fontFamily: "var(--font-dm-sans), Arial, sans-serif",
          transition: "opacity 0.15s",
          opacity: loading ? 0.8 : 1,
        }}
      >
        {loading ? "Redirecting to checkout…" : "Buy now — £9.99"}
      </button>
      {error && (
        <p
          style={{
            marginTop: 8,
            fontSize: 12,
            color: "#fca5a5",
            textAlign: "center",
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
