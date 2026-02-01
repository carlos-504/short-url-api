import { Inject, Injectable } from '@nestjs/common';
import type {
  ShortUrlEntity,
  IShortUrlRepository,
} from '../../../domain/short-url';
import { SHORT_URL_REPOSITORY } from '../../../common/tokens';

@Injectable()
export class ListShortUrlsUseCase {
  constructor(
    @Inject(SHORT_URL_REPOSITORY)
    private readonly shortUrlRepository: IShortUrlRepository,
  ) {}

  async execute(userId?: number): Promise<ShortUrlEntity[]> {
    return this.shortUrlRepository.findAll(userId);
  }
}
