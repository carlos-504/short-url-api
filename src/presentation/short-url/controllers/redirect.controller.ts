import type { Response } from 'express';
import { Controller, Get, Param, Res } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RedirectShortUrlUseCase } from '../../../application/short-url';

@ApiTags('Redirecionamento')
@Controller('r')
export class RedirectController {
  constructor(
    private readonly redirectShortUrlUseCase: RedirectShortUrlUseCase,
  ) {}

  @Get(':code')
  @ApiOperation({
    summary: 'Acessar URL encurtada',
    description:
      'Redireciona para a URL de origem e contabiliza o acesso (incrementa cliques). Qualquer um pode acessar.',
  })
  @ApiParam({
    name: 'code',
    description: 'Código encurtado (até 6 caracteres)',
    example: 'aZbKq7',
  })
  @ApiResponse({
    status: 302,
    description: 'Redirecionamento para a URL de origem',
  })
  @ApiResponse({ status: 404, description: 'URL encurtada não encontrada' })
  async redirect(
    @Param('code') code: string,
    @Res() res: Response,
  ): Promise<void> {
    const shortUrl = await this.redirectShortUrlUseCase.execute(code);
    res.redirect(302, shortUrl.originalUrl);
  }
}
