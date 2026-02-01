import { ConflictException, Inject, Injectable } from '@nestjs/common';
import type {
  ShortUrlEntity,
  IShortUrlRepository,
} from '../../../domain/short-url';
import { SHORT_URL_REPOSITORY } from '../../../common/tokens';
import type { CreateShortUrlInput } from '../dtos/create-short-url.dto';

const SHORT_CODE_LENGTH = 6;
const ALPHANUMERIC =
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const MAX_ATTEMPTS = 10;

@Injectable()
export class CreateShortUrlUseCase {
  constructor(
    @Inject(SHORT_URL_REPOSITORY)
    private readonly shortUrlRepository: IShortUrlRepository,
  ) {}

  async execute(dto: CreateShortUrlInput): Promise<ShortUrlEntity> {
    let shortCode: string;
    let attempts = 0;

    do {
      shortCode = this.generateShortCode();
      const existing = await this.shortUrlRepository.findByShortCode(shortCode);
      if (!existing) break;
      attempts++;
    } while (attempts < MAX_ATTEMPTS);

    if (attempts >= MAX_ATTEMPTS) {
      throw new ConflictException(
        'Não foi possível gerar um código único. Tente novamente.',
      );
    }

    return this.shortUrlRepository.create(
      dto.originalUrl,
      shortCode,
      dto.userId,
    );
  }

  private generateShortCode(): string {
    let result = '';
    for (let i = 0; i < SHORT_CODE_LENGTH; i++) {
      result += ALPHANUMERIC.charAt(
        Math.floor(Math.random() * ALPHANUMERIC.length),
      );
    }
    return result;
  }
}
