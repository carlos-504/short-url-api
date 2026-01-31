import type { UserEntity } from '../../domain/entities/user.entity';

export interface UserResponseDto {
  id: number;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export function toUserResponse(entity: UserEntity): UserResponseDto {
  return {
    id: entity.id,
    email: entity.email,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  };
}
