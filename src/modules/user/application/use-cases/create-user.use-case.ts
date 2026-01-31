import { Inject, Injectable } from '@nestjs/common';
import type { UserEntity } from '../../domain/entities/user.entity';
import {
  type IUserRepository,
  USER_REPOSITORY,
} from '../../domain/repositories/user.repository.interface';
import type { CreateUserDto } from '../dtos/create-user.dto';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(dto: CreateUserDto): Promise<UserEntity> {
    return this.userRepository.create(dto.email);
  }
}
