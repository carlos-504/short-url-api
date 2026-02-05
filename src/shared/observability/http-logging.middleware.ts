import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';
import { LOGGER_SERVICE } from './tokens';
import type { LoggerService } from './logger.service';

@Injectable()
export class HttpLoggingMiddleware implements NestMiddleware {
  constructor(@Inject(LOGGER_SERVICE) private readonly logger: LoggerService) {}

  use(req: Request, _res: Response, next: NextFunction): void {
    const path = req.originalUrl || req.url || '/';
    this.logger.info(`LOG - ${req.method} ${path}`);
    next();
  }
}
