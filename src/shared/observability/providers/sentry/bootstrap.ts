import 'dotenv/config';
import * as Sentry from '@sentry/nestjs';

function parseBoolean(value: string | undefined): boolean {
  if (value === undefined || value === '') return false;
  return value.toLowerCase() === 'true' || value === '1';
}

export function initSentryIfEnabled(): void {
  if (!parseBoolean(process.env.OBSERVABILITY_ENABLED)) return;

  const dsn = process.env.SENTRY_DSN;
  if (!dsn || dsn.trim() === '') return;

  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV ?? 'development',
    release: process.env.SENTRY_RELEASE,
    tracesSampleRate: 1.0,
    maxBreadcrumbs: 50,
  });
}
