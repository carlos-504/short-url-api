import { Injectable } from '@nestjs/common';
import { prisma } from '../../../library/prisma';
import type { IUserRepository, UserEntity } from '../../../domain/user';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<UserEntity | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async create(email: string, password: string): Promise<UserEntity> {
    return prisma.user.create({
      data: { email, password } as any,
    });
  }
}
