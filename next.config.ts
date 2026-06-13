import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Set the Turbopack root to this project directory (silences multi-lockfile warning)
  turbopack: {
    root: path.resolve(__dirname),
  },
  // Enable static exports for Netlify (optional — Netlify supports SSR too)
  // output: 'export',

  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },

  // Redirects: www and HTTP are handled by Netlify
  async redirects() {
    return [
      // Legacy URL cleanup if needed
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
