import type { Response } from 'express';
import { Controller, Get, Param, Res } from '@nestjs/common';
import { RedirectShortUrlUseCase } from '../../application/use-cases/redirect-short-url.use-case';

@Controller('r')
export class RedirectController {
  constructor(
    private readonly redirectShortUrlUseCase: RedirectShortUrlUseCase,
  ) {}

  @Get(':code')
  async redirect(
    @Param('code') code: string,
    @Res() res: Response,
  ): Promise<void> {
    const shortUrl = await this.redirectShortUrlUseCase.execute(code);
    res.redirect(302, shortUrl.originalUrl);
  }
}
