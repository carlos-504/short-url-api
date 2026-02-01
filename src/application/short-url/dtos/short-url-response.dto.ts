import type { ShortUrlEntity } from '../../../domain/short-url';

export interface ShortUrlResponseDto {
  id: number;
  originalUrl: string;
  shortCode: string;
  clicks: string;
  userId: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export function toShortUrlResponse(
  entity: ShortUrlEntity,
): ShortUrlResponseDto {
  return {
    id: entity.id,
    originalUrl: entity.originalUrl,
    shortCode: entity.shortCode,
    clicks: entity.clicks.toString(),
    userId: entity.userId,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  };
}
