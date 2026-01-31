import type { Response } from 'express';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { CreateShortUrlUseCase } from '../../application/use-cases/create-short-url.use-case';
import { ListShortUrlsUseCase } from '../../application/use-cases/list-short-urls.use-case';
import { GetShortUrlByIdUseCase } from '../../application/use-cases/get-short-url-by-id.use-case';
import { UpdateShortUrlUseCase } from '../../application/use-cases/update-short-url.use-case';
import { DeleteShortUrlUseCase } from '../../application/use-cases/delete-short-url.use-case';
import { CreateShortUrlDto } from '../../application/dtos/create-short-url.dto';
import { UpdateShortUrlDto } from '../../application/dtos/update-short-url.dto';
import {
  toShortUrlResponse,
  type ShortUrlResponseDto,
} from '../../application/dtos/short-url-response.dto';
import { ParseIntPipe } from '@nestjs/common';

@Controller('url')
export class ShortUrlController {
  constructor(
    private readonly createShortUrlUseCase: CreateShortUrlUseCase,
    private readonly listShortUrlsUseCase: ListShortUrlsUseCase,
    private readonly getShortUrlByIdUseCase: GetShortUrlByIdUseCase,
    private readonly updateShortUrlUseCase: UpdateShortUrlUseCase,
    private readonly deleteShortUrlUseCase: DeleteShortUrlUseCase,
  ) {}

  @Post()
  async create(
    @Body() dto: CreateShortUrlDto,
    @Res() res: Response,
  ): Promise<void> {
    const shortUrl = await this.createShortUrlUseCase.execute(dto);
    res.status(HttpStatus.CREATED).send({
      message: 'URL encurtada criada com sucesso',
      data: toShortUrlResponse(shortUrl),
    });
  }

  @Get()
  async list(@Res() res: Response): Promise<void> {
    const list = await this.listShortUrlsUseCase.execute();
    const data: ShortUrlResponseDto[] = list.map(toShortUrlResponse);
    res.status(HttpStatus.OK).send({ data });
  }

  @Get(':id')
  async getById(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<void> {
    const shortUrl = await this.getShortUrlByIdUseCase.execute(id);
    res.status(HttpStatus.OK).send({
      data: toShortUrlResponse(shortUrl),
    });
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateShortUrlDto,
    @Res() res: Response,
  ): Promise<void> {
    const shortUrl = await this.updateShortUrlUseCase.execute(id, dto);
    res.status(HttpStatus.OK).send({
      message: 'URL de destino atualizada com sucesso',
      data: toShortUrlResponse(shortUrl),
    });
  }

  @Delete(':id')
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<void> {
    await this.deleteShortUrlUseCase.execute(id);
    res.status(HttpStatus.NO_CONTENT).send();
  }
}
