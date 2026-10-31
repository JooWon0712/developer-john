import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  devIndicators: false,
  redirects() {
    return [
      {
        source: "/:path*",
        has: [
          { type: "host", value: "(?:www\\.)?developer-john\\.com" },
          { type: "header", key: "x-forwarded-proto", value: "http" },
        ],
        destination: "https://developer-john.com/:path*",
        permanent: true,
      },
      {
        source: "/game/the-division-2/:path*",
        destination: "/services/game/the-division-2/:path*",
        permanent: true,
      },
      {
        source: "/en/game/the-division-2/:path*",
        destination: "/en/services/game/the-division-2/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
