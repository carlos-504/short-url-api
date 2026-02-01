import type { Response } from 'express';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  CreateShortUrlUseCase,
  ListShortUrlsUseCase,
  UpdateShortUrlUseCase,
  DeleteShortUrlUseCase,
  CreateShortUrlDto,
  UpdateShortUrlDto,
  toShortUrlResponse,
  type ShortUrlResponseDto,
} from '../../../application/short-url';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../../auth/guards/optional-jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';

const BASE_URL =
  process.env.APP_URL ?? process.env.BASE_URL ?? 'http://localhost:3000';

@Controller('short-url')
export class ShortUrlController {
  constructor(
    private readonly createShortUrlUseCase: CreateShortUrlUseCase,
    private readonly listShortUrlsUseCase: ListShortUrlsUseCase,
    private readonly updateShortUrlUseCase: UpdateShortUrlUseCase,
    private readonly deleteShortUrlUseCase: DeleteShortUrlUseCase,
  ) {}

  @Post()
  @UseGuards(OptionalJwtAuthGuard)
  async create(
    @Body() dto: CreateShortUrlDto,
    @Res() res: Response,
    @CurrentUser('userId') userId?: number,
  ): Promise<void> {
    const shortUrl = await this.createShortUrlUseCase.execute({
      ...dto,
      userId: userId ?? undefined,
    });
    res.status(HttpStatus.CREATED).send({
      message: 'URL encurtada criada com sucesso',
      data: toShortUrlResponse(shortUrl, BASE_URL),
    });
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async list(
    @Res() res: Response,
    @CurrentUser('userId') userId: number,
  ): Promise<void> {
    const list = await this.listShortUrlsUseCase.execute(userId);
    const data: ShortUrlResponseDto[] = list.map((item) =>
      toShortUrlResponse(item, BASE_URL),
    );
    res.status(HttpStatus.OK).send({ data });
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateShortUrlDto,
    @Res() res: Response,
    @CurrentUser('userId') userId: number,
  ): Promise<void> {
    const shortUrl = await this.updateShortUrlUseCase.execute(id, dto, userId);
    res.status(HttpStatus.OK).send({
      message: 'URL de destino atualizada com sucesso',
      data: toShortUrlResponse(shortUrl, BASE_URL),
    });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
    @CurrentUser('userId') userId: number,
  ): Promise<void> {
    await this.deleteShortUrlUseCase.execute(id, userId);
    res.status(HttpStatus.NO_CONTENT).send();
  }
}
