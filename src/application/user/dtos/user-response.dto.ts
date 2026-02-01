import { ApiProperty } from '@nestjs/swagger';

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
