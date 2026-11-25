import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";
// PostHog loads its recorder from the assets host next to its API host (us.i → us-assets.i).
const posthog = process.env.NEXT_PUBLIC_POSTHOG_KEY ? (process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com") : "";
const posthogAssets = posthog.replace("://us.i.", "://us-assets.i.").replace("://eu.i.", "://eu-assets.i.");

// No-nonce CSP from the Next.js 16 guide (docs/01-app/02-guides/content-security-policy.md), plus the hosts this app uses.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} ${posthogAssets}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data: https://avatars.githubusercontent.com",
  "font-src 'self'",
  `connect-src 'self' ${posthog} ${posthogAssets}`,
  "worker-src 'self' blob:", // canvas-confetti draws in a worker made from a blob URL
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  isDev ? "" : "upgrade-insecure-requests",
]
  .filter(Boolean)
  .map((d) => d.trim())
  .join("; ");

const security = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  ...(isDev ? [] : [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" }]),
];

const config: NextConfig = {
  // e2b uses Node APIs; load it from node_modules at runtime instead of bundling it.
  serverExternalPackages: ["e2b"],
  async headers() {
    return [{ source: "/(.*)", headers: security }];
  },
};

export default config;
