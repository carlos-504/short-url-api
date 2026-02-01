import type { Response } from 'express';
import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { LoginUseCase } from '../../../application/auth/use-cases/login.use-case';
import { CreateUserUseCase } from '../../../application/user/use-cases/create-user.use-case';
import { LoginDto } from '../../../application/auth/dtos/login.dto';
import { CreateUserDto } from '../../../application/user/dtos/create-user.dto';
import { UserResponseMapper } from '../../../application/user';
import { sendResponse } from '../../../common/http';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Public } from '../decorators/public.decorator';

@ApiTags('Autenticação')
@Controller('auth')
@UseGuards(JwtAuthGuard)
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly jwtService: JwtService,
    private readonly userResponseMapper: UserResponseMapper,
  ) {}

  @Post('login')
  @Public()
  @ApiOperation({
    summary: 'Login',
    description:
      'Autentica com e-mail e senha. Retorna Bearer Token (accessToken).',
  })
  @ApiResponse({ status: 200, description: 'Login realizado com sucesso' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  async login(@Body() dto: LoginDto, @Res() res: Response): Promise<void> {
    const user = await this.loginUseCase.execute(dto);
    const payload = { sub: String(user.userId), email: user.email };
    const accessToken = this.jwtService.sign(payload);
    sendResponse(res, HttpStatus.OK, {
      accessToken,
      user: {
        id: user.userId,
        email: user.email,
      },
    });
  }

  @Post('register')
  @Public()
  @ApiOperation({
    summary: 'Cadastro de usuário',
    description: 'Cria novo usuário. Retorna Bearer Token (accessToken).',
  })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso. Retorna accessToken e user.',
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 409, description: 'E-mail já cadastrado' })
  async register(
    @Body() dto: CreateUserDto,
    @Res() res: Response,
  ): Promise<void> {
    const user = await this.createUserUseCase.execute(dto);
    const payload = { sub: String(user.id), email: user.email };
    const accessToken = this.jwtService.sign(payload);
    sendResponse(res, HttpStatus.CREATED, {
      message: 'Usuário criado com sucesso',
      accessToken,
      user: this.userResponseMapper.toDto(user),
    });
  }
}
