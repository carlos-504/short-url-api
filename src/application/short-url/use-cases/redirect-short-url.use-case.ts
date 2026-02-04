import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SHORT_URL_REPOSITORY } from '../../../common/tokens';
import type {
  ShortUrlEntity,
  IShortUrlRepository,
} from '../../../domain/short-url';
import { decodeId } from '../../../common/utils/hashids';

@Injectable()
export class RedirectShortUrlUseCase {
  constructor(
    @Inject(SHORT_URL_REPOSITORY)
    private readonly shortUrlRepository: IShortUrlRepository,
  ) {}

  async execute(shortCode: string): Promise<ShortUrlEntity> {
    const id = decodeId(shortCode);
    if (id === null) {
      throw new NotFoundException('URL encurtada não encontrada');
    }

    const shortUrl = await this.shortUrlRepository.findById(id);
    if (!shortUrl) {
      throw new NotFoundException('URL encurtada não encontrada');
    }

    await this.shortUrlRepository.incrementClicks(shortUrl.id);

    return shortUrl;
  }
}
