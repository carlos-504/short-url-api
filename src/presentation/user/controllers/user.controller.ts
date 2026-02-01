import type { Response } from 'express';
import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import {
  CreateUserUseCase,
  CreateUserDto,
  toUserResponse,
} from '../../../application/user';

@Controller('user')
export class UserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const user = await this.createUserUseCase.execute(createUserDto);

    return res.status(HttpStatus.CREATED).send({
      message: 'User created successfully',
      data: toUserResponse(user),
    });
  }
}
