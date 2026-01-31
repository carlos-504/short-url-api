import { Injectable } from '@nestjs/common';
import type { User } from '../../generated/prisma/client';
import { UserRepository } from '../../library/repository/User.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(email: string): Promise<User> {
    const user = await this.userRepository.create(email);

    return user;
  }
}
