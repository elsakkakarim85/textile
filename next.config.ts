import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  allowedDevOrigins: ['mahalla-cluster-2026.loca.lt', 'https://mahalla-cluster-2026.loca.lt'],
  serverExternalPackages: ['@prisma/client', 'prisma'],
  outputFileTracingIncludes: {
    "/**/*": ["./prisma/**/*"]
  }
};

export default withNextIntl(nextConfig);
