import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import type { UserEntity, IUserRepository } from '../../../domain/user';
import { USER_REPOSITORY } from '../../../common/tokens';
import { authConfig } from '../../../config/auth.config';
import type { CreateUserDto } from '../dtos/create-user.dto';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(dto: CreateUserDto): Promise<UserEntity> {
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new BadRequestException('Email já cadastrado');
    }
    const hashedPassword = await bcrypt.hash(
      dto.password,
      authConfig.bcryptSaltRounds,
    );
    return this.userRepository.create(dto.email, hashedPassword);
  }
}
