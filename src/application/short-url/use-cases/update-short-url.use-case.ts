import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SHORT_URL_REPOSITORY } from '../../../common/tokens';
import type {
  ShortUrlEntity,
  IShortUrlRepository,
} from '../../../domain/short-url';
import type { UpdateShortUrlDto } from '../dtos/update-short-url.dto';

@Injectable()
export class UpdateShortUrlUseCase {
  constructor(
    @Inject(SHORT_URL_REPOSITORY)
    private readonly shortUrlRepository: IShortUrlRepository,
  ) {}

  async execute(id: number, dto: UpdateShortUrlDto): Promise<ShortUrlEntity> {
    const existing = await this.shortUrlRepository.findById(id);
    if (!existing) {
      throw new NotFoundException('URL encurtada não encontrada');
    }
    return this.shortUrlRepository.updateDestination(id, dto.originalUrl);
  }
}
