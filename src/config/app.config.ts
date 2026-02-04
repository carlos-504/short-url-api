import type { Request } from 'express';

export function getBaseUrlFromRequest(req: Request): string {
  const proto = req.get('x-forwarded-proto') ?? req.protocol;
  const host =
    req.get('x-forwarded-host') ?? req.get('host') ?? 'localhost:3000';
  return `${proto}://${host}`.replace(/\/$/, '');
}
