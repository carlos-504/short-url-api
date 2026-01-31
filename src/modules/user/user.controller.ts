import type { Response } from 'express';
import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { ValidateCreateUserPipe } from '../../common/pipes/validate-create-user.pipe';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(
    @Body(ValidateCreateUserPipe) createUserDto: CreateUserDto,
    @Res() res: Response,
  ) {
    const user = await this.userService.create(createUserDto.email);

    return res.status(HttpStatus.CREATED).send({
      message: 'User created successfully',
      data: user,
    });
  }
}
