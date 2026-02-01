import { ApiProperty } from '@nestjs/swagger';
import type { ShortUrlEntity } from '../../../domain/short-url';

const BASE_URL =
  process.env.APP_URL ?? process.env.BASE_URL ?? 'http://localhost:3000';

export class ShortUrlResponseDto {
  @ApiProperty({ example: 1, description: 'ID do registro' })
  id: number;

  @ApiProperty({ description: 'URL de origem' })
  originalUrl: string;

  @ApiProperty({
    example: 'aZbKq7',
    description: 'Código encurtado (até 6 caracteres)',
  })
  shortCode: string;

  @ApiProperty({
    example: 'http://localhost:3000/r/aZbKq7',
    description: 'URL encurtada completa (incluindo domínio)',
  })
  shortUrl: string;

  @ApiProperty({ example: '42', description: 'Quantidade de acessos/cliques' })
  clicks: string;

  @ApiProperty({
    nullable: true,
    description: 'ID do usuário dono (null se anônimo)',
  })
  userId: number | null;

  @ApiProperty({ description: 'Data de criação' })
  createdAt: Date;

  @ApiProperty({ description: 'Data de última atualização' })
  updatedAt: Date;
}

export function toShortUrlResponse(
  entity: ShortUrlEntity,
  baseUrl: string = BASE_URL,
): ShortUrlResponseDto {
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
