import { Inject, Injectable } from '@nestjs/common';
import type { ShortUrlEntity } from '../../domain/entities/short-url.entity';
import {
  type IShortUrlRepository,
  SHORT_URL_REPOSITORY,
} from '../../domain/repositories/short-url.repository.interface';

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
