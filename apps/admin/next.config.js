// eslint-disable-next-line import/no-unresolved
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import million from 'million/compiler';

const __dirname = dirname(fileURLToPath(import.meta.url));

const millionConfig = {
  auto: { rsc: true },
};

/** @type {import("next").NextConfig} */
const config = {
  output: 'standalone',
  outputFileTracingRoot: join(__dirname, '../..'),
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
  transpilePackages: ['@repo/db', '@repo/auth'],
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
export default million.next(config, millionConfig);
