import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  type IShortUrlRepository,
  SHORT_URL_REPOSITORY,
} from '../../domain/repositories/short-url.repository.interface';

@Injectable()
export class DeleteShortUrlUseCase {
  constructor(
    @Inject(SHORT_URL_REPOSITORY)
    private readonly shortUrlRepository: IShortUrlRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const existing = await this.shortUrlRepository.findById(id);
    if (!existing) {
      throw new NotFoundException('URL encurtada não encontrada');
    }
    await this.shortUrlRepository.softDelete(id);
  }
}
