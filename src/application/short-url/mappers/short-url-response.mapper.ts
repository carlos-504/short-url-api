import { Injectable } from '@nestjs/common';
import type { ShortUrlEntity } from '../../../domain/short-url';
import type { ShortUrlResponseDto } from '../dtos/short-url-response.dto';

const DEFAULT_BASE_URL =
  process.env.APP_URL ?? process.env.BASE_URL ?? 'http://localhost:3000';

@Injectable()
export class ShortUrlResponseMapper {
  toDto(
    entity: ShortUrlEntity,
    baseUrl: string = DEFAULT_BASE_URL,
  ): ShortUrlResponseDto {
    const shortUrl = `${baseUrl.replace(/\/$/, '')}/short-url/r/${entity.shortCode}`;

    return {
      id: entity.id,
      originalUrl: entity.originalUrl,
      shortCode: entity.shortCode,
      shortUrl,
      clicks: entity.clicks.toString(),
      userId: entity.userId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
