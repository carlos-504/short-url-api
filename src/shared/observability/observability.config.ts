/**
 * Configuração de observabilidade carregada via variáveis de ambiente.
 * OBSERVABILITY_ENABLED=false ou ausente → provider noop.
 * OBSERVABILITY_PROVIDER=sentry|console|noop (quando enabled=true).
 */
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
  /** Ativa ou desativa observabilidade. Se false, usa provider noop. */
  enabled: parseBoolean(process.env.OBSERVABILITY_ENABLED),

  /** Provider: sentry | console | noop. Se desativado, sempre noop. */
  provider: (): ObservabilityProvider => {
    if (!parseBoolean(process.env.OBSERVABILITY_ENABLED)) return 'noop';
    return parseProvider(process.env.OBSERVABILITY_PROVIDER);
  },

  /** DSN do Sentry (quando provider=sentry). */
  sentryDsn: process.env.SENTRY_DSN,

  /** Nome do serviço. */
  serviceName: process.env.npm_package_name || 'short-url-api',

  /** Usar pino-pretty (formato legível) em vez de JSON. Ativado por LOG_PRETTY=true ou NODE_ENV !== 'production'. */
  usePinoPretty:
    process.env.LOG_PRETTY === 'true' ||
    process.env.LOG_PRETTY === '1' ||
    process.env.NODE_ENV !== 'production',
} as const;

/**
 * Opções base para instâncias Pino.
 * Quando usePinoPretty=true, usa transport pino-pretty (saída legível e colorida).
 */
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
