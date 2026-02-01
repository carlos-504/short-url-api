import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { SHORT_URL_REPOSITORY } from '../../common/tokens';
import {
  CreateShortUrlUseCase,
  ListShortUrlsUseCase,
  UpdateShortUrlUseCase,
  DeleteShortUrlUseCase,
  RedirectShortUrlUseCase,
  ShortUrlResponseMapper,
} from '../../application/short-url';
import { PrismaShortUrlRepository } from '../../infrastructure/short-url';
import {
  ShortUrlController,
  RedirectController,
} from '../../presentation/short-url';

@Module({
  imports: [AuthModule],
  controllers: [ShortUrlController, RedirectController],
  providers: [
    CreateShortUrlUseCase,
    ListShortUrlsUseCase,
    UpdateShortUrlUseCase,
    DeleteShortUrlUseCase,
    RedirectShortUrlUseCase,
    ShortUrlResponseMapper,
    {
      provide: SHORT_URL_REPOSITORY,
      useClass: PrismaShortUrlRepository,
    },
  ],
})
export class ShortUrlModule {}
