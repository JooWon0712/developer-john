import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  devIndicators: false,
  redirects() {
    return [
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
