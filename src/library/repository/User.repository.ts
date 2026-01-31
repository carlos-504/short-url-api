import { Injectable } from '@nestjs/common';
import { prisma } from '../prisma';
import { User } from '../../generated/prisma/client';

@Injectable()
export class UserRepository {
  findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  create(email: string): Promise<User> {
    return prisma.user.create({
      data: {
        email,
      },
    });
  }
}
