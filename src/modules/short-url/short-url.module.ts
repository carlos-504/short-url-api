import { Module } from '@nestjs/common';
import { SHORT_URL_REPOSITORY } from './domain/repositories/short-url.repository.interface';
import { CreateShortUrlUseCase } from './application/use-cases/create-short-url.use-case';
import { ListShortUrlsUseCase } from './application/use-cases/list-short-urls.use-case';
import { GetShortUrlByIdUseCase } from './application/use-cases/get-short-url-by-id.use-case';
import { UpdateShortUrlUseCase } from './application/use-cases/update-short-url.use-case';
import { DeleteShortUrlUseCase } from './application/use-cases/delete-short-url.use-case';
import { RedirectShortUrlUseCase } from './application/use-cases/redirect-short-url.use-case';
import { PrismaShortUrlRepository } from './infrastructure/repositories/prisma-short-url.repository';
import { ShortUrlController } from './presentation/controllers/short-url.controller';
import { RedirectController } from './presentation/controllers/redirect.controller';

@Module({
  controllers: [ShortUrlController, RedirectController],
  providers: [
    CreateShortUrlUseCase,
    ListShortUrlsUseCase,
    GetShortUrlByIdUseCase,
    UpdateShortUrlUseCase,
    DeleteShortUrlUseCase,
    RedirectShortUrlUseCase,
    {
      provide: SHORT_URL_REPOSITORY,
      useClass: PrismaShortUrlRepository,
    },
  ],
})
export class ShortUrlModule {}
