import { Module } from '@nestjs/common';
import { USER_REPOSITORY } from '../common/tokens';
import { CreateUserUseCase } from '../application/user';
import { UserController } from '../presentation/user';
import { PrismaUserRepository } from '../infrastructure/user';

@Module({
  controllers: [UserController],
  providers: [
    CreateUserUseCase,
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [CreateUserUseCase, USER_REPOSITORY],
})
export class UserModule {}
