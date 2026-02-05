import pino from 'pino';
import { getPinoBaseOptions } from '../../observability.config';
import type { LoggerService, LogMeta } from '../../logger.service';

export class ConsoleLoggerService implements LoggerService {
  private readonly pino: pino.Logger;
  private readonly context: LogMeta;

  constructor(context: LogMeta = {}) {
    this.context = context;
    this.pino = pino(getPinoBaseOptions() as pino.LoggerOptions);
  }

  private mergeMeta(meta?: LogMeta): Record<string, unknown> {
    const merged = { ...this.context, ...meta };
    return Object.fromEntries(
      Object.entries(merged).filter(
        ([, v]) => v !== undefined && v !== null,
      ) as [string, string | number | boolean][],
    );
  }

  debug(message: string, meta?: LogMeta): void {
    this.pino.debug(this.mergeMeta(meta), message);
  }

  info(message: string, meta?: LogMeta): void {
    this.pino.info(this.mergeMeta(meta), message);
  }

  warn(message: string, meta?: LogMeta): void {
    this.pino.warn(this.mergeMeta(meta), message);
  }

  error(message: string, meta?: LogMeta): void {
    this.pino.error(this.mergeMeta(meta), message);
  }

  child(context: LogMeta): LoggerService {
    return new ConsoleLoggerService({ ...this.context, ...context });
  }
}
