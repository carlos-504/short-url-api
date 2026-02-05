import type { ShortUrlEntity } from '../entities/short-url.entity';

export const SHORT_URL_REPOSITORY = Symbol('SHORT_URL_REPOSITORY');

export interface IShortUrlRepository {
  create(
    originalUrl: string,
    shortCode: string,
    userId?: number,
  ): Promise<ShortUrlEntity>;
  createWithGeneratedCode(
    originalUrl: string,
    userId?: number,
  ): Promise<ShortUrlEntity>;
  findById(id: number): Promise<ShortUrlEntity | null>;
  findByIdAndUserId(id: number, userId: number): Promise<ShortUrlEntity | null>;
  findByShortCode(shortCode: string): Promise<ShortUrlEntity | null>;
  findAll(userId?: number): Promise<ShortUrlEntity[]>;
  updateDestination(id: number, originalUrl: string): Promise<ShortUrlEntity>;
  softDelete(id: number): Promise<void>;
  incrementClicks(id: number): Promise<void>;
}
