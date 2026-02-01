import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import type { IShortUrlRepository } from '../../../domain/short-url';
import { SHORT_URL_REPOSITORY } from '../../../common/tokens';

@Injectable()
export class DeleteShortUrlUseCase {
  constructor(
    @Inject(SHORT_URL_REPOSITORY)
    private readonly shortUrlRepository: IShortUrlRepository,
  ) {}

  async execute(id: number, userId: number): Promise<void> {
    const existing = await this.shortUrlRepository.findByIdAndUserId(
      id,
      userId,
    );

    if (!existing) {
      throw new ForbiddenException(
        'URL encurtada não encontrada ou você não tem permissão para excluí-la',
      );
    }

    await this.shortUrlRepository.softDelete(id);
  }
}
