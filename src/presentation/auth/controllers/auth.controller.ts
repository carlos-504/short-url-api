import type { Response } from 'express';
import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUseCase } from '../../../application/auth/use-cases/login.use-case';
import { CreateUserUseCase } from '../../../application/user/use-cases/create-user.use-case';
import { LoginDto } from '../../../application/auth/dtos/login.dto';
import { CreateUserDto } from '../../../application/user/dtos/create-user.dto';
import { toUserResponse } from '../../../application/user/dtos/user-response.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Public } from '../decorators/public.decorator';

@Controller('auth')
@UseGuards(JwtAuthGuard)
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly jwtService: JwtService,
  ) {}

  @Post('login')
  @Public()
  async login(@Body() dto: LoginDto, @Res() res: Response): Promise<void> {
    const user = await this.loginUseCase.execute(dto);
    const payload = { sub: String(user.userId), email: user.email };
    const accessToken = this.jwtService.sign(payload);
    res.status(HttpStatus.OK).send({
      accessToken,
      user: {
        id: user.userId,
        email: user.email,
      },
    });
  }

  @Post('register')
  @Public()
  async register(
    @Body() dto: CreateUserDto,
    @Res() res: Response,
  ): Promise<void> {
    const user = await this.createUserUseCase.execute(dto);
    const payload = { sub: String(user.id), email: user.email };
    const accessToken = this.jwtService.sign(payload);
    res.status(HttpStatus.CREATED).send({
      message: 'Usuário criado com sucesso',
      accessToken,
      user: toUserResponse(user),
    });
  }
}
