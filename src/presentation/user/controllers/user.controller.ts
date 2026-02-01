import type { Response } from 'express';
import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateUserUseCase,
  CreateUserDto,
  UserResponseMapper,
} from '../../../application/user';
import { sendResponse } from '../../../common/http';

@ApiTags('Usuário')
@Controller('user')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly userResponseMapper: UserResponseMapper,
  ) {}

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

    sendResponse(res, HttpStatus.CREATED, {
      message: 'User created successfully',
      data: this.userResponseMapper.toDto(user),
    });
  }
}
