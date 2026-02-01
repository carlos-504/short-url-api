import { Injectable } from '@nestjs/common';
import type { UserEntity } from '../../../domain/user';
import type { UserResponseDto } from '../dtos/user-response.dto';

@Injectable()
export class UserResponseMapper {
  toDto(entity: UserEntity): UserResponseDto {
    return {
      id: entity.id,
      email: entity.email,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
