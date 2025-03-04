import { env } from "./src/env/server.mjs";
import withBundleAnalyzer from "@next/bundle-analyzer";
import { withSentryConfig } from "@sentry/nextjs";
import * as pack from './package.json' assert { type: "json" };

/**
 * Don't be scared of the generics here.
 * All they do is to give us autocompletion when using this.
 *
 * @template {import("next").NextConfig} T
 * @param {T} config - A generic parameter that flows through to the return type
 * @constraint {{import("next").NextConfig}}
 */
function defineNextConfig(config) {
	// https://stackoverflow.com/a/68437008/6912830
	const bundleAnalyzer = withBundleAnalyzer({
		enabled: process.env.ANALYZE === "true",
	});

    if (process.env.NODE_ENV !== "development")
        return withSentryConfig(bundleAnalyzer(config), {silent: true});

    return bundleAnalyzer(config);
}

export const nextConfig = {
	output: "export",
	reactStrictMode: true,
	swcMinify: true,
	// Next.js i18n docs: https://nextjs.org/docs/advanced-features/i18n-routing
	i18n: {
		locales: ["en"],
		defaultLocale: "en",
	},
	async redirects() {
		return [
			{
				source: "/tos",
				destination: "/terms-of-service",
				permanent: true,
			},
		];
	},
	// TODO: Remove this once we don't use external images
	images: {
		loader: "akamai", // Use Cloudflare-compatible loader
		path: "/",
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**.*",
			},
		],
	},
	sentry: {
		hideSourceMaps: true,
	},
	experimental: {
		appDir: false,
	},
	publicRuntimeConfig: {
		version: pack.default.version,
	},
};

export default defineNextConfig(nextConfig);
