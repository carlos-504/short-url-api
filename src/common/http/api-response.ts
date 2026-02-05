import type { Response } from 'express';

export interface ApiResponseBody<T = unknown> {
  message?: string;
  data?: T;
  [key: string]: unknown;
}

export function sendResponse<T>(
  res: Response,
  statusCode: number,
  body: ApiResponseBody<T>,
): void {
  res.status(statusCode).json(body);
}
