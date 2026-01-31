import {
  BadRequestException,
  Inject,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import {
  type IUserRepository,
  USER_REPOSITORY,
} from '../../domain/repositories/user.repository.interface';
import type { CreateUserDto } from '../../application/dtos/create-user.dto';

@Injectable()
export class ValidateCreateUserPipe implements PipeTransform<CreateUserDto> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async transform(value: CreateUserDto): Promise<CreateUserDto> {
    const existingUser = await this.userRepository.findByEmail(value.email);

    if (existingUser) {
      throw new BadRequestException('Email já cadastrado');
    }

    return value;
  }
}
