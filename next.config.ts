import type { NextConfig } from "next";
import { Config } from 'tailwindcss'

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  // Configure React to ignore specific attributes during hydration
  // This helps prevent errors from browser extensions like Grammarly
  skipTrailingSlashRedirect: true,
  skipMiddlewareUrlNormalize: true,
  experimental: {
    // Other experimental features can go here
    serverActions: {
      allowedOrigins: ['*']
    },
  },
  // Suppress hydration warnings in development
  onDemandEntries: {
    // Keep pages in memory for longer during development
    maxInactiveAge: 25 * 1000,
    // Number of pages to keep in memory
    pagesBufferLength: 2,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  output: 'standalone',
};

export default nextConfig;
