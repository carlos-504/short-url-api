import type { UserEntity } from '../../src/common/entities';

export const mockUserEntity: UserEntity = {
  id: 1,
  email: 'test@example.com',
  password: 'hashedPassword123',
  createdAt: new Date('2024-01-01T00:00:00.000Z'),
  updatedAt: new Date('2024-01-01T00:00:00.000Z'),
  deletedAt: null,
};

export const mockUserResponse = {
  id: 1,
  email: 'test@example.com',
  createdAt: new Date('2024-01-01T00:00:00.000Z'),
  updatedAt: new Date('2024-01-01T00:00:00.000Z'),
};

export const createMockUser = (
  overrides?: Partial<UserEntity>,
): UserEntity => ({
  ...mockUserEntity,
  ...overrides,
});
