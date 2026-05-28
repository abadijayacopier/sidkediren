import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  webpack: (config) => {
    config.watchOptions = {
      ignored: [
        '**/System Volume Information/**',
        '**/hiberfil.sys',
        '**/pagefile.sys',
        '**/dumpstack.log.tmp',
        '**/node_modules/**'
      ],
    };
    return config;
  },
};

export default nextConfig;
