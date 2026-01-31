import { Injectable } from '@nestjs/common';
import { prisma } from '../../../../library/prisma';
import type { IUserRepository } from '../../domain/repositories/user.repository.interface';
import type { UserEntity } from '../../domain/entities/user.entity';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<UserEntity | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async create(email: string): Promise<UserEntity> {
    return prisma.user.create({
      data: { email },
    });
  }
}
