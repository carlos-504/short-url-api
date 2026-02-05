import {
  DynamicModule,
  Global,
  Controller,
  Get,
  Inject,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
  Res,
} from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { SentryGlobalFilter, SentryModule } from '@sentry/nestjs/setup';
import type * as express from 'express';
import { LoggerModule } from 'nestjs-pino';
import { observabilityConfig } from './observability.config';
import { LOGGER_SERVICE, METRICS_SERVICE, TRACING_SERVICE } from './tokens';
import {
  NoopLoggerService,
  NoopMetricsService,
  NoopTracingService,
} from './providers/noop';
import {
  ConsoleLoggerService,
  ConsoleMetricsService,
  ConsoleTracingService,
} from './providers/console';
import type { LoggerService, MetricsService, TracingService } from '.';
import { getPinoBaseOptions } from './observability.config';
import { HttpLoggingMiddleware } from './http-logging.middleware';

function getProviderClasses(): {
  Logger: new (context?: Record<string, unknown>) => LoggerService;
  Metrics: new () => MetricsService;
  Tracing: new () => TracingService;
} {
  const provider = observabilityConfig.provider();
  switch (provider) {
    case 'sentry':
    case 'console':
      return {
        Logger: ConsoleLoggerService as new (
          context?: Record<string, unknown>,
        ) => LoggerService,
        Metrics: ConsoleMetricsService,
        Tracing: ConsoleTracingService,
      };
    default:
      return {
        Logger: NoopLoggerService as new (
          context?: Record<string, unknown>,
        ) => LoggerService,
        Metrics: NoopMetricsService,
        Tracing: NoopTracingService,
      };
  }
}

@Controller()
class MetricsController {
  constructor(
    @Inject(METRICS_SERVICE) private readonly metricsService: MetricsService,
  ) {}

  @Get('metrics')
  async metrics(@Res() res: express.Response): Promise<void> {
    res.set('Content-Type', this.metricsService.getContentType());
    res.send(await this.metricsService.getMetrics());
  }
}

@Global()
@Module({})
export class ObservabilityModule implements NestModule {
  static forRoot(): DynamicModule {
    const provider = observabilityConfig.provider();
    const { Logger, Metrics, Tracing } = getProviderClasses();

    const imports: DynamicModule['imports'] = [];
    if (provider !== 'noop') {
      imports.push(
        LoggerModule.forRoot({
          pinoHttp: {
            ...getPinoBaseOptions(),
            autoLogging: false,
          },
        }),
      );
    }
    if (provider === 'sentry') {
      imports.push(SentryModule.forRoot());
    }

    const providers: DynamicModule['providers'] = [
      { provide: LOGGER_SERVICE, useClass: Logger },
      { provide: METRICS_SERVICE, useClass: Metrics },
      { provide: TRACING_SERVICE, useClass: Tracing },
    ];
    if (provider !== 'noop') {
      providers.push(HttpLoggingMiddleware);
    }
    if (provider === 'sentry') {
      providers.push({
        provide: APP_FILTER,
        useClass: SentryGlobalFilter,
      });
    }

    return {
      module: ObservabilityModule,
      imports,
      controllers: [MetricsController],
      providers,
      exports: [LOGGER_SERVICE, METRICS_SERVICE, TRACING_SERVICE],
    };
  }

  configure(consumer: MiddlewareConsumer): void {
    if (observabilityConfig.provider() !== 'noop') {
      consumer
        .apply(HttpLoggingMiddleware)
        .forRoutes({ path: '*', method: RequestMethod.ALL });
    }
  }
}
