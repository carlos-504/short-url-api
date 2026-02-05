/**
 * Abstração de Logger para observabilidade.
 * A aplicação depende apenas desta interface; implementações ficam nos providers.
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogMeta {
  [key: string]: string | number | boolean | undefined | null;
}

export interface LoggerService {
  debug(message: string, meta?: LogMeta): void;
  info(message: string, meta?: LogMeta): void;
  warn(message: string, meta?: LogMeta): void;
  error(message: string, meta?: LogMeta): void;
  child(context: LogMeta): LoggerService;
}
