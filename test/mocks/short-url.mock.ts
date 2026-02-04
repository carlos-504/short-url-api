import type { ShortUrlEntity } from '../../src/common/entities';

export const mockShortUrlEntity: ShortUrlEntity = {
  id: 1,
  originalUrl: 'https://example.com/very-long-url',
  shortCode: 'abc123',
  clicks: BigInt(0),
  userId: 1,
  createdAt: new Date('2024-01-01T00:00:00.000Z'),
  updatedAt: new Date('2024-01-01T00:00:00.000Z'),
  deletedAt: null,
};

export const mockShortUrlResponse = {
  id: 1,
  originalUrl: 'https://example.com/very-long-url',
  shortCode: 'abc123',
  shortUrl: 'http://localhost:3000/r/abc123',
  clicks: '0',
  userId: 1,
  createdAt: new Date('2024-01-01T00:00:00.000Z'),
  updatedAt: new Date('2024-01-01T00:00:00.000Z'),
};

export const createMockShortUrl = (
  overrides?: Partial<ShortUrlEntity>,
): ShortUrlEntity => ({
  ...mockShortUrlEntity,
  ...overrides,
});
