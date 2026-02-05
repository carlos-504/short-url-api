import { Injectable } from '@nestjs/common';
import { prisma } from '../../../library/prisma';
import type {
  ShortUrlEntity,
  IShortUrlRepository,
} from '../../../domain/short-url';
import { encodeId } from '../../../common/utils/hashids';
import { mapPrismaToDomain } from '../../shared/prisma-to-domain';

@Injectable()
export class PrismaShortUrlRepository implements IShortUrlRepository {
  async createWithGeneratedCode(
    originalUrl: string,
    userId?: number,
  ): Promise<ShortUrlEntity> {
    const [{ nextval }] = await prisma.$queryRaw<[{ nextval: bigint }]>`
      SELECT nextval(pg_get_serial_sequence('short_urls', 'id')) as nextval
    `;
    const id = Number(nextval);
    const shortCode = encodeId(id);
    const created = await prisma.shortUrl.create({
      data: {
        id,
        originalUrl,
        shortCode,
        userId: userId ?? null,
      },
    });
    return mapPrismaToDomain<ShortUrlEntity>(created);
  }

  async create(
    originalUrl: string,
    shortCode: string,
    userId?: number,
  ): Promise<ShortUrlEntity> {
    const created = await prisma.shortUrl.create({
      data: {
        originalUrl,
        shortCode,
        userId: userId ?? null,
      },
    });
    return mapPrismaToDomain<ShortUrlEntity>(created);
  }

  async findById(id: number): Promise<ShortUrlEntity | null> {
    const row = await prisma.shortUrl.findFirst({
      where: { id, deletedAt: null },
    });
    return row ? mapPrismaToDomain<ShortUrlEntity>(row) : null;
  }

  async findByIdAndUserId(
    id: number,
    userId: number,
  ): Promise<ShortUrlEntity | null> {
    const row = await prisma.shortUrl.findFirst({
      where: { id, userId, deletedAt: null },
    });
    return row ? mapPrismaToDomain<ShortUrlEntity>(row) : null;
  }

  async findByShortCode(shortCode: string): Promise<ShortUrlEntity | null> {
    const row = await prisma.shortUrl.findFirst({
      where: { shortCode, deletedAt: null },
    });
    return row ? mapPrismaToDomain<ShortUrlEntity>(row) : null;
  }

  async findAll(userId?: number): Promise<ShortUrlEntity[]> {
    const rows = await prisma.shortUrl.findMany({
      where: {
        deletedAt: null,
        ...(userId !== undefined && { userId }),
      },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((r) => mapPrismaToDomain<ShortUrlEntity>(r));
  }

  async updateDestination(
    id: number,
    originalUrl: string,
  ): Promise<ShortUrlEntity> {
    const updated = await prisma.shortUrl.update({
      where: { id, deletedAt: null },
      data: { originalUrl },
    });
    return mapPrismaToDomain<ShortUrlEntity>(updated);
  }

  async softDelete(id: number): Promise<void> {
    await prisma.shortUrl.update({
      where: { id, deletedAt: null },
      data: { deletedAt: new Date() },
    });
  }

  async incrementClicks(id: number): Promise<void> {
    await prisma.shortUrl.update({
      where: { id, deletedAt: null },
      data: { clicks: { increment: 1 } },
    });
  }
}
