import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
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
  turbopack: {},
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
