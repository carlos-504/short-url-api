import type { Request, Response } from 'express';

export const createMockResponse = (): Partial<Response> => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
  redirect: jest.fn(),
});

export const createMockRequest = (
  overrides?: Partial<Pick<Request, 'protocol' | 'get'>>,
): Partial<Request> => ({
  protocol: 'http',
  get: jest.fn((name: string): string | string[] | undefined => {
    if (name === 'host') return 'localhost:3000';
    return undefined;
  }) as Request['get'],
  ...overrides,
});
