import type { Response } from 'express';
import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UsePipes,
} from '@nestjs/common';
import { ValidateCreateUserPipe } from '../validation';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { CreateUserDto } from '../../application/dtos/create-user.dto';
import { toUserResponse } from '../../application/dtos/user-response.dto';

@Controller('user')
export class UserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post()
  @UsePipes(ValidateCreateUserPipe)
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const user = await this.createUserUseCase.execute(createUserDto);

    return res.status(HttpStatus.CREATED).send({
      message: 'User created successfully',
      data: toUserResponse(user),
    });
  }
}
