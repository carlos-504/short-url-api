import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { UserRepository } from '../../library/repository/User.repository';
import type { CreateUserDto } from '../../modules/user/dto/create-user.dto';

@Injectable()
export class ValidateCreateUserPipe implements PipeTransform<CreateUserDto> {
  constructor(private readonly userRepository: UserRepository) {}

  async transform(value: CreateUserDto): Promise<CreateUserDto> {
    const existingUser = await this.userRepository.findByEmail(value.email);

    if (existingUser) {
      throw new BadRequestException('Email já cadastrado');
    }

    return value;
  }
}
