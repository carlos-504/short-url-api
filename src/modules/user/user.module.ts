import { Module } from '@nestjs/common';
import { ValidateCreateUserPipe } from '../../common/pipes/validate-create-user.pipe';
import { UserRepository } from '../../library/repository/User.repository';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserRepository, UserService, ValidateCreateUserPipe],
})
export class UserModule {}
