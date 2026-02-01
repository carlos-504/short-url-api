import { Module } from '@nestjs/common';
import { SHORT_URL_REPOSITORY } from '../common/tokens';
import {
  CreateShortUrlUseCase,
  ListShortUrlsUseCase,
  GetShortUrlByIdUseCase,
  UpdateShortUrlUseCase,
  DeleteShortUrlUseCase,
  RedirectShortUrlUseCase,
} from '../application/short-url';
import { PrismaShortUrlRepository } from '../infrastructure/short-url';
import {
  ShortUrlController,
  RedirectController,
} from '../presentation/short-url';

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
