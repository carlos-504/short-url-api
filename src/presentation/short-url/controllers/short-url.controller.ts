import type { Request, Response } from 'express';
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
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateShortUrlUseCase,
  ListShortUrlsUseCase,
  UpdateShortUrlUseCase,
  DeleteShortUrlUseCase,
  CreateShortUrlDto,
  CreateShortUrlInput,
  UpdateShortUrlDto,
  ShortUrlResponseDto,
  ShortUrlResponseMapper,
} from '../../../application/short-url';
import { sendResponse } from '../../../common/http';
import { getBaseUrlFromRequest } from '../../../config/app.config';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../../auth/guards/optional-jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';

@ApiTags('URL Encurtada')
@Controller('short-url')
export class ShortUrlController {
  constructor(
    private readonly createShortUrlUseCase: CreateShortUrlUseCase,
    private readonly listShortUrlsUseCase: ListShortUrlsUseCase,
    private readonly updateShortUrlUseCase: UpdateShortUrlUseCase,
    private readonly deleteShortUrlUseCase: DeleteShortUrlUseCase,
    private readonly shortUrlResponseMapper: ShortUrlResponseMapper,
  ) {}

  @Post()
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({
    summary: 'Encurtar URL',
    description:
      'Aceita requisições com ou sem autenticação. Se autenticado, associa a URL ao usuário. Retorna a URL encurtada incluindo o domínio.',
    security: [{ 'access-token': [] }, {}],
  })
  @ApiResponse({
    status: 201,
    description: 'URL encurtada criada',
    type: ShortUrlResponseDto,
  })
  @ApiResponse({ status: 400, description: 'URL inválida' })
  @ApiResponse({ status: 409, description: 'Conflito ao gerar código único' })
  async create(
    @Body() dto: CreateShortUrlDto,
    @Req() req: Request,
    @Res() res: Response,
    @CurrentUser('userId') userId?: number,
  ): Promise<void> {
    const input: CreateShortUrlInput = {
      originalUrl: dto.originalUrl,
      userId,
    };

    const shortUrl = await this.createShortUrlUseCase.execute(input);

    sendResponse(res, HttpStatus.CREATED, {
      message: 'URL encurtada criada com sucesso',
      data: this.shortUrlResponseMapper.toDto(
        shortUrl,
        getBaseUrlFromRequest(req),
      ),
    });
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Listar URLs do usuário',
    description:
      'Lista URLs encurtadas pelo usuário autenticado, com quantidade de cliques.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de URLs encurtadas',
    type: [ShortUrlResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async list(
    @Req() req: Request,
    @Res() res: Response,
    @CurrentUser('userId') userId: number,
  ): Promise<void> {
    const list = await this.listShortUrlsUseCase.execute(userId);
    const baseUrl = getBaseUrlFromRequest(req);

    const data = list.map((item) =>
      this.shortUrlResponseMapper.toDto(item, baseUrl),
    );

    sendResponse(res, HttpStatus.OK, { data });
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Atualizar URL de destino',
    description: 'Atualiza a URL de origem de um URL encurtado do usuário.',
  })
  @ApiResponse({
    status: 200,
    description: 'URL de destino atualizada',
    type: ShortUrlResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({
    status: 403,
    description: 'URL não encontrada ou sem permissão',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateShortUrlDto,
    @Req() req: Request,
    @Res() res: Response,
    @CurrentUser('userId') userId: number,
  ): Promise<void> {
    const shortUrl = await this.updateShortUrlUseCase.execute(id, dto, userId);

    sendResponse(res, HttpStatus.OK, {
      message: 'URL de destino atualizada com sucesso',
      data: this.shortUrlResponseMapper.toDto(
        shortUrl,
        getBaseUrlFromRequest(req),
      ),
    });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Excluir URL encurtada',
    description:
      'Exclusão lógica (soft delete) de um URL encurtado do usuário.',
  })
  @ApiResponse({ status: 204, description: 'Excluído com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({
    status: 403,
    description: 'URL não encontrada ou sem permissão',
  })
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
    @CurrentUser('userId') userId: number,
  ): Promise<void> {
    await this.deleteShortUrlUseCase.execute(id, userId);

    sendResponse(res, HttpStatus.NO_CONTENT, {
      message: 'URL encurtada excluída com sucesso',
    });
  }
}
