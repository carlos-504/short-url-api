import { ApiProperty } from '@nestjs/swagger';
import type { UserEntity } from '../../../domain/user';

export class UserResponseDto {
  @ApiProperty({ example: 1, description: 'ID do usuário' })
  id: number;

  @ApiProperty({ example: 'usuario@email.com', description: 'E-mail' })
  email: string;

  @ApiProperty({ description: 'Data de criação' })
  createdAt: Date;

  @ApiProperty({ description: 'Data de última atualização' })
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
