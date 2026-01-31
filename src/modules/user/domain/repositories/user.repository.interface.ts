import type { UserEntity } from '../entities/user.entity';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface IUserRepository {
  findByEmail(email: string): Promise<UserEntity | null>;
  create(email: string): Promise<UserEntity>;
}
