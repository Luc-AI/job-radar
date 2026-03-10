import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Capture 10% of requests for performance tracing in production
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  // Disable Sentry in development to avoid noise
  enabled: process.env.NODE_ENV === "production",

  debug: false,
});
