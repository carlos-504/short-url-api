import { Injectable } from '@nestjs/common';
import type { ShortUrlEntity } from '../../../domain/short-url';
import type { ShortUrlResponseDto } from '../dtos/short-url-response.dto';

@Injectable()
export class ShortUrlResponseMapper {
  toDto(entity: ShortUrlEntity, baseUrl: string): ShortUrlResponseDto {
    const shortUrl = `${baseUrl.replace(/\/$/, '')}/r/${entity.shortCode}`;

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
