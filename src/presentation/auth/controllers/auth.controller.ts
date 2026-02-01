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
import { LoginDto } from '../../../application/auth/dtos/login.dto';
import { sendResponse } from '../../../common/http';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Public } from '../decorators/public.decorator';

@ApiTags('Autenticação')
@Controller('auth')
@UseGuards(JwtAuthGuard)
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly jwtService: JwtService,
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
}
