import { Injectable } from '@nestjs/common';
import { prisma } from '../../../library/prisma';
import type {
  ShortUrlEntity,
  IShortUrlRepository,
} from '../../../domain/short-url';
import { encodeId } from '../../../common/utils/hashids';

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
    return prisma.shortUrl.create({
      data: {
        id,
        originalUrl,
        shortCode,
        userId: userId ?? null,
      },
    });
  }

  async create(
    originalUrl: string,
    shortCode: string,
    userId?: number,
  ): Promise<ShortUrlEntity> {
    return prisma.shortUrl.create({
      data: {
        originalUrl,
        shortCode,
        userId: userId ?? null,
      },
    });
  }

  async findById(id: number): Promise<ShortUrlEntity | null> {
    return prisma.shortUrl.findFirst({
      where: { id, deletedAt: null },
    });
  }

  async findByIdAndUserId(
    id: number,
    userId: number,
  ): Promise<ShortUrlEntity | null> {
    return prisma.shortUrl.findFirst({
      where: { id, userId, deletedAt: null },
    });
  }

  async findByShortCode(shortCode: string): Promise<ShortUrlEntity | null> {
    return prisma.shortUrl.findFirst({
      where: { shortCode, deletedAt: null },
    });
  }

  async findAll(userId?: number): Promise<ShortUrlEntity[]> {
    return prisma.shortUrl.findMany({
      where: {
        deletedAt: null,
        ...(userId !== undefined && { userId }),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateDestination(
    id: number,
    originalUrl: string,
  ): Promise<ShortUrlEntity> {
    return prisma.shortUrl.update({
      where: { id, deletedAt: null },
      data: { originalUrl },
    });
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
