# Observabilidade

O projeto possui uma camada de observabilidade **centralizada e desacoplada** em `src/shared/observability/`. A aplicação não depende diretamente de OpenTelemetry ou qualquer ferramenta específica.

## Arquitetura

- **Abstrações:** LoggerService, MetricsService, TracingService
- **Providers:** noop, console, sentry (Strategy Pattern)
- **Ativação:** variáveis de ambiente `OBSERVABILITY_ENABLED` e `OBSERVABILITY_PROVIDER`

## Estrutura

```
src/shared/observability/
├── observability.module.ts    # Módulo NestJS com Strategy Pattern
├── logger.service.ts          # Interface LoggerService
├── metrics.service.ts         # Interface MetricsService
├── tracing.service.ts         # Interface TracingService
├── observability.config.ts    # Config via env
├── tokens.ts                  # LOGGER_SERVICE, METRICS_SERVICE, TRACING_SERVICE
├── index.ts
└── providers/
    ├── noop/                  # Sem efeito (enabled=false ou provider=noop)
    ├── console/               # Pino + prom-client
    └── sentry/                # Bootstrap Sentry (erros, performance)
```

## Variáveis de ambiente

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `OBSERVABILITY_ENABLED` | Ativa (`true`) ou desativa (`false`) observabilidade. | `true` |
| `OBSERVABILITY_PROVIDER` | Provider: `sentry` \| `console` \| `noop` | `sentry` |
| `SENTRY_DSN` | DSN do projeto Sentry. | `https://xxx@xxx.ingest.sentry.io/xxx` |
| `LOG_LEVEL` | Nível de log (pino). | `info` |

- **OBSERVABILITY_ENABLED=false** ou omitido → provider noop
- **OBSERVABILITY_PROVIDER=noop** → Logger, Metrics, Tracing sem efeito
- **OBSERVABILITY_PROVIDER=console** → Pino (stdout) + prom-client (/metrics), sem tracing distribuído
- **OBSERVABILITY_PROVIDER=sentry** → Sentry (erros, performance) + Pino + prom-client

## Endpoints

- **GET /metrics** — Métricas em formato Prometheus (quando provider ≠ noop)

## Uso no código

A aplicação depende apenas das abstrações. Nunca importe OpenTelemetry em controllers, services, use-cases, domain ou repositories.

```ts
import { Injectable, Inject } from '@nestjs/common';
import { LOGGER_SERVICE, METRICS_SERVICE } from './shared/observability';
import type { LoggerService, MetricsService } from './shared/observability';

@Injectable()
export class MyService {
  private readonly logger: LoggerService;
  private readonly counter: ReturnType<MetricsService['createCounter']>;

  constructor(
    @Inject(LOGGER_SERVICE) logger: LoggerService,
    @Inject(METRICS_SERVICE) metrics: MetricsService,
  ) {
    this.logger = logger.child({ service: 'MyService' });
    this.counter = metrics.createCounter('my_requests_total', {
      help: 'Total de requisições',
      labelNames: ['status'],
    });
  }

  async doWork(input: string): Promise<string> {
    this.logger.info('Iniciando trabalho', { input });
    try {
      const result = await this.someAsyncWork(input);
      this.counter.inc(1, { status: 'success' });
      return result;
    } catch (error) {
      this.counter.inc(1, { status: 'error' });
      throw error;
    }
  }
}
```

## Tracing

Com provider=sentry, o Sentry rastreia performance de requisições HTTP automaticamente.

## Logs

- **Pino** + **pino-http** integrados ao NestJS (via nestjs-pino) quando provider ≠ noop

## Métricas

- **prom-client** com endpoint **/metrics** em formato Prometheus
- CollectDefaultMetrics ativa para métricas de runtime (memória, event loop, etc.)

## Sentry (provider=sentry)

Quando `OBSERVABILITY_PROVIDER=sentry` e `SENTRY_DSN` está definido:

- **Erros não tratados:** captura automática
- **Exceções HTTP:** captura via SentryGlobalFilter
- **Performance:** tracing básico de requests (tracesSampleRate: 1.0)

Crie uma conta em [sentry.io](https://sentry.io), crie um projeto Node.js e copie o DSN. Configure no `.env`:

```env
OBSERVABILITY_ENABLED=true
OBSERVABILITY_PROVIDER=sentry
SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
NODE_ENV=production
```

## Extensibilidade

A arquitetura permite adicionar futuros providers (Datadog, New Relic, Sentry) sem alterar o código de domínio ou aplicação.
