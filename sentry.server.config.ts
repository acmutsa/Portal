import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
	dsn:
		SENTRY_DSN ||
		"https://12011e3447a740d997a695265e5b9dfa@o4504323589603328.ingest.sentry.io/4504323613982720",
	// We recommend adjusting this value in production, or using tracesSampler
	// for finer control
	tracesSampleRate: 1.0,
	// ...
	// Note: if you want to override the automatic release value, do not set a
	// `release` value here - use the environment variable `SENTRY_RELEASE`, so
	// that it will also get attached to your source maps
});
