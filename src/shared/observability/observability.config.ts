function parseBoolean(value: string | undefined): boolean {
  if (value === undefined || value === '') return false;
  return value.toLowerCase() === 'true' || value === '1';
}

export type ObservabilityProvider = 'noop' | 'console' | 'sentry';

function parseProvider(value: string | undefined): ObservabilityProvider {
  const v = (value ?? 'noop').toLowerCase();
  if (v === 'sentry') return 'sentry';
  if (v === 'console') return 'console';
  return 'noop';
}

export const observabilityConfig = {
  enabled: parseBoolean(process.env.OBSERVABILITY_ENABLED),
  provider: (): ObservabilityProvider => {
    if (!parseBoolean(process.env.OBSERVABILITY_ENABLED)) return 'noop';
    return parseProvider(process.env.OBSERVABILITY_PROVIDER);
  },

  sentryDsn: process.env.SENTRY_DSN,
  serviceName: process.env.npm_package_name || 'short-url-api',

  usePinoPretty:
    process.env.LOG_PRETTY === 'true' ||
    process.env.LOG_PRETTY === '1' ||
    process.env.NODE_ENV !== 'production',
} as const;

export function getPinoBaseOptions(): Record<string, unknown> {
  const level = process.env.LOG_LEVEL ?? 'info';
  const base: Record<string, unknown> = {
    level,
    base: undefined,
    formatters: { level: (label: string) => ({ level: label }) },
  };
  if (observabilityConfig.usePinoPretty) {
    base.transport = {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:HH:MM:ss',
        ignore: 'pid,hostname',
      },
    };
  }
  return base;
}
