import type { Response } from 'express';

/**
 * Corpo padrão das respostas da API.
 * - message: opcional, mensagem descritiva (ex.: "URL encurtada criada com sucesso").
 * - data: opcional, payload da resposta (lista ou objeto).
 * - Permite chaves extras para casos específicos (ex.: accessToken, user em auth).
 */
export interface ApiResponseBody<T = unknown> {
  message?: string;
  data?: T;
  [key: string]: unknown;
}

/**
 * Envia resposta JSON padronizada.
 * Uso: sendResponse(res, HttpStatus.CREATED, { message: '...', data: ... });
 */
export function sendResponse<T>(
  res: Response,
  statusCode: number,
  body: ApiResponseBody<T>,
): void {
  res.status(statusCode).json(body);
}
