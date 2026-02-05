import { Injectable } from '@nestjs/common';
import { prisma } from '../../../library/prisma';
import type { IUserRepository, UserEntity } from '../../../domain/user';
import { mapPrismaToDomain } from '../../shared/prisma-to-domain';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<UserEntity | null> {
    const row = await prisma.user.findUnique({
      where: { email },
    });
    return row ? mapPrismaToDomain<UserEntity>(row) : null;
  }

  async create(email: string, password: string): Promise<UserEntity> {
    const created = await prisma.user.create({
      data: { email, password },
    });
    return mapPrismaToDomain<UserEntity>(created);
  }
}
