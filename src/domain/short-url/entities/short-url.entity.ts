import type { BaseEntity } from '../../base-entity';

export interface ShortUrlEntity extends BaseEntity {
  originalUrl: string;
  shortCode: string;
  clicks: bigint;
  userId: number | null;
}
