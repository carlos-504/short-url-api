import type { UserEntity } from '../entities/user.entity';
import { USER_REPOSITORY } from '../../../common/tokens';

export { USER_REPOSITORY };

export interface IUserRepository {
  findByEmail(email: string): Promise<UserEntity | null>;
  create(email: string, password: string): Promise<UserEntity>;
}
