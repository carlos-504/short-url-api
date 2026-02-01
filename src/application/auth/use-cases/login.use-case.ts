import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {
  type IUserRepository,
  USER_REPOSITORY,
} from '../../../domain/user/repositories/user.repository.interface';
import type { LoginDto } from '../dtos/login.dto';
import type { LoginResult } from '../types/login-result';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(dto: LoginDto): Promise<LoginResult> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }
    const userWithPassword = user as unknown as { password: string };
    const passwordMatch = await bcrypt.compare(
      dto.password,
      userWithPassword.password,
    );
    if (!passwordMatch) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }
    return {
      userId: user.id,
      email: user.email,
    };
  }
}
