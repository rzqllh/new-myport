import type { NextConfig } from "next";

const isDevelopment = process.env.NODE_ENV !== "production";

const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ""} https://challenges.cloudflare.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https: wss:",
  "frame-src https://challenges.cloudflare.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },

  async redirects() {
    return [
      { source: "/projects", destination: "/work", permanent: true },
      {
        source: "/projects/:slug",
        destination: "/work/:slug",
        permanent: true,
      },
      { source: "/blog", destination: "/insights", permanent: true },
      {
        source: "/blog/:slug",
        destination: "/insights/:slug",
        permanent: true,
      },
      { source: "/id/projects", destination: "/id/work", permanent: true },
      {
        source: "/id/projects/:slug",
        destination: "/id/work/:slug",
        permanent: true,
      },
      { source: "/id/blog", destination: "/id/insights", permanent: true },
      {
        source: "/id/blog/:slug",
        destination: "/id/insights/:slug",
        permanent: true,
      },
    ];
  },

  async rewrites() {
    return {
      beforeFiles: [
        { source: "/work", destination: "/projects" },
        { source: "/work/:slug", destination: "/projects/:slug" },
        { source: "/insights", destination: "/blog" },
        { source: "/insights/:slug", destination: "/blog/:slug" },
        { source: "/id", destination: "/?locale=id" },
        { source: "/id/work", destination: "/projects?locale=id" },
        {
          source: "/id/work/:slug",
          destination: "/projects/:slug?locale=id",
        },
        { source: "/id/insights", destination: "/blog?locale=id" },
        {
          source: "/id/insights/:slug",
          destination: "/blog/:slug?locale=id",
        },
        { source: "/id/about", destination: "/about?locale=id" },
        { source: "/id/contact", destination: "/contact?locale=id" },
        { source: "/id/resume", destination: "/resume?locale=id" },
      ],
    };
  },
};

export default nextConfig;
