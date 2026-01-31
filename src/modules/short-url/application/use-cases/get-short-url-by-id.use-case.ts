import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { ShortUrlEntity } from '../../domain/entities/short-url.entity';
import {
  type IShortUrlRepository,
  SHORT_URL_REPOSITORY,
} from '../../domain/repositories/short-url.repository.interface';

@Injectable()
export class GetShortUrlByIdUseCase {
  constructor(
    @Inject(SHORT_URL_REPOSITORY)
    private readonly shortUrlRepository: IShortUrlRepository,
  ) {}

  async execute(id: number): Promise<ShortUrlEntity> {
    const shortUrl = await this.shortUrlRepository.findById(id);
    if (!shortUrl) {
      throw new NotFoundException('URL encurtada não encontrada');
    }
    return shortUrl;
  }
}
