const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/6oU14n6xseSqapCfp15kk00";

export default function DownloadButton() {
  return (
    <a
      href={STRIPE_PAYMENT_LINK}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "block",
        width: "100%",
        background: "#FF00FF",
        color: "#ffffff",
        fontWeight: 700,
        fontSize: 15,
        padding: "14px 24px",
        borderRadius: 24,
        border: "none",
        textAlign: "center",
        textDecoration: "none",
        fontFamily: "var(--font-dm-sans), Arial, sans-serif",
        boxSizing: "border-box",
      }}
    >
      Buy now — £9.99
    </a>
  );
}
