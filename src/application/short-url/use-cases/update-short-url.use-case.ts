import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
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

  async execute(
    id: number,
    dto: UpdateShortUrlDto,
    userId: number,
  ): Promise<ShortUrlEntity> {
    const existing = await this.shortUrlRepository.findByIdAndUserId(
      id,
      userId,
    );

    if (!existing) {
      throw new ForbiddenException(
        'URL encurtada não encontrada ou você não tem permissão para editá-la',
      );
    }

    return this.shortUrlRepository.updateDestination(id, dto.originalUrl);
  }
}
