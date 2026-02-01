import type { ShortUrlEntity } from '../entities/short-url.entity';

export interface IShortUrlRepository {
  create(
    originalUrl: string,
    shortCode: string,
    userId?: number,
  ): Promise<ShortUrlEntity>;
  findById(id: number): Promise<ShortUrlEntity | null>;
  findByShortCode(shortCode: string): Promise<ShortUrlEntity | null>;
  findAll(userId?: number): Promise<ShortUrlEntity[]>;
  updateDestination(id: number, originalUrl: string): Promise<ShortUrlEntity>;
  softDelete(id: number): Promise<void>;
  incrementClicks(id: number): Promise<void>;
}
