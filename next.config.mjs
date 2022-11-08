import { env } from "./src/env/server.mjs";
import withBundleAnalyzer from "@next/bundle-analyzer";

/**
 * Don't be scared of the generics here.
 * All they do is to give us autocompletion when using this.
 *
 * @template {import('next').NextConfig} T
 * @param {T} config - A generic parameter that flows through to the return type
 * @constraint {{import('next').NextConfig}}
 */
function defineNextConfig(config) {
  // https://stackoverflow.com/a/68437008/6912830
  const bundleAnalyzer = withBundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
  });

  return bundleAnalyzer(config);
}

export const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  // Next.js i18n docs: https://nextjs.org/docs/advanced-features/i18n-routing
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  // TODO: Remove this once we don't use external images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.*'
      }
    ]
  }
};

export default defineNextConfig(nextConfig);
