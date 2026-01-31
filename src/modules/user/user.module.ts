import { Module } from '@nestjs/common';
import { USER_REPOSITORY } from './domain/repositories/user.repository.interface';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { PrismaUserRepository } from './infrastructure/repositories/prisma-user.repository';
import { UserController } from './presentation/controllers/user.controller';
import { ValidateCreateUserPipe } from './presentation/validation';

@Module({
  controllers: [UserController],
  providers: [
    CreateUserUseCase,
    ValidateCreateUserPipe,
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
  ],
})
export class UserModule {}
