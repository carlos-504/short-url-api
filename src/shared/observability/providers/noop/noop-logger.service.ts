/* eslint-disable @typescript-eslint/no-unused-vars */
import type { LoggerService, LogMeta } from '../../logger.service';

export class NoopLoggerService implements LoggerService {
  debug(_message: string, _meta?: LogMeta): void {
    // no-op
  }

  info(_message: string, _meta?: LogMeta): void {
    // no-op
  }

  warn(_message: string, _meta?: LogMeta): void {
    // no-op
  }

  error(_message: string, _meta?: LogMeta): void {
    // no-op
  }

  child(_context: LogMeta): LoggerService {
    return this;
  }
}
