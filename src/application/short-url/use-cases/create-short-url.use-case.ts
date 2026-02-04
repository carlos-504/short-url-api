import { Inject, Injectable } from '@nestjs/common';
import type {
  ShortUrlEntity,
  IShortUrlRepository,
} from '../../../domain/short-url';
import { SHORT_URL_REPOSITORY } from '../../../common/tokens';
import type { CreateShortUrlInput } from '../dtos/create-short-url.dto';

@Injectable()
export class CreateShortUrlUseCase {
  constructor(
    @Inject(SHORT_URL_REPOSITORY)
    private readonly shortUrlRepository: IShortUrlRepository,
  ) {}

  async execute(dto: CreateShortUrlInput): Promise<ShortUrlEntity> {
    return this.shortUrlRepository.createWithGeneratedCode(
      dto.originalUrl,
      dto.userId,
    );
  }
}
