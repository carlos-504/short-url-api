/**
 * Re-exporta os tipos de entidade gerados pelo Prisma.
 * Fonte única de verdade: prisma/schema.prisma
 * O domínio utiliza esses tipos com nomenclatura amigável (Entity).
 */
export type { User as UserEntity } from '../../generated/prisma/client';
export type { ShortUrl as ShortUrlEntity } from '../../generated/prisma/client';
