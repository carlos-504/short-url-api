import type { Response } from 'express';
import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateUserUseCase,
  CreateUserDto,
  toUserResponse,
} from '../../../application/user';
@ApiTags('Usuário')
@Controller('user')
export class UserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post()
  @ApiOperation({
    summary: 'Criar usuário (alternativo)',
    description:
      'Cria novo usuário. Para cadastro com token JWT, use POST /auth/register.',
  })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 409, description: 'E-mail já cadastrado' })
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const user = await this.createUserUseCase.execute(createUserDto);

    return res.status(HttpStatus.CREATED).send({
      message: 'User created successfully',
      data: toUserResponse(user),
    });
  }
}
