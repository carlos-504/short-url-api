import { Module } from '@nestjs/common';
import { USER_REPOSITORY } from '../common/tokens';
import { CreateUserUseCase } from '../application/user/';
import { PrismaUserRepository } from '../infrastructure/user';
import { UserController } from '../presentation/user/index';

@Module({
  controllers: [UserController],
  providers: [
    CreateUserUseCase,
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
  ],
})
export class UserModule {}
