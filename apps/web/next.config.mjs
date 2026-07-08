// NOTE: this whole package is bugged and once they fix this we can remove this workaround
import bundleAnalyzer from '@next/bundle-analyzer';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
// eslint-disable-next-line import/no-unresolved
import million from 'million/compiler';

const __dirname = dirname(fileURLToPath(import.meta.url));

const millionConfig = {
  auto: { rsc: true },
};
const isProd = process.env.NODE_ENV === 'production';
/** @type {import("next").NextConfig} */
const nextConfig = {
  output: 'standalone',
  outputFileTracingRoot: join(__dirname, '../..'),
  async headers() {
    return !isProd
      ? [
          {
            // allow CORS only on dev for admin site to get monaco files
            source: '/min/vs/(.*)',
            headers: [
              { key: 'Access-Control-Allow-Origin', value: '*' },
              { key: 'Access-Control-Allow-Methods', value: 'GET' },
            ],
          },
        ]
      : [];
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    });
    return config;
  },
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  transpilePackages: ['@repo/db', '@repo/ui', '@repo/auth', '@repo/monaco'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'uploadthing.com',
      },
    ],
  },
};
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default million.next(withBundleAnalyzer(nextConfig), millionConfig);
