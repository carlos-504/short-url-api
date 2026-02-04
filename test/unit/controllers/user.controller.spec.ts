import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { UserController } from '../../../src/presentation/user/controllers/user.controller';
import {
  CreateUserUseCase,
  CreateUserDto,
  UserResponseMapper,
} from '../../../src/application/user';
import {
  mockUserEntity,
  mockUserResponse,
  createMockResponse,
} from '../../mocks';

describe('UserController', () => {
  let controller: UserController;
  let createUserUseCase: jest.Mocked<CreateUserUseCase>;
  let userResponseMapper: jest.Mocked<UserResponseMapper>;
  let mockResponse: Partial<Response>;

  beforeEach(async () => {
    const mockCreateUserUseCase = {
      execute: jest.fn(),
    };

    const mockUserResponseMapper = {
      toDto: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: CreateUserUseCase,
          useValue: mockCreateUserUseCase,
        },
        {
          provide: UserResponseMapper,
          useValue: mockUserResponseMapper,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    createUserUseCase = module.get(CreateUserUseCase);
    userResponseMapper = module.get(UserResponseMapper);

    mockResponse = createMockResponse();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user successfully', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'Password123!',
      };

      createUserUseCase.execute.mockResolvedValue(mockUserEntity);
      userResponseMapper.toDto.mockReturnValue(mockUserResponse);

      await controller.create(createUserDto, mockResponse as Response);

      expect(createUserUseCase.execute).toHaveBeenCalledWith(createUserDto);
      expect(createUserUseCase.execute).toHaveBeenCalledTimes(1);

      expect(userResponseMapper.toDto).toHaveBeenCalledWith(mockUserEntity);
      expect(userResponseMapper.toDto).toHaveBeenCalledTimes(1);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Usuário cadastrado com sucesso',
        data: mockUserResponse,
      });
    });

    it('should propagate error when use case fails', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'Password123!',
      };

      const error = new Error('Email already registered');
      createUserUseCase.execute.mockRejectedValue(error);

      await expect(
        controller.create(createUserDto, mockResponse as Response),
      ).rejects.toThrow(error);

      expect(createUserUseCase.execute).toHaveBeenCalledWith(createUserDto);
      expect(userResponseMapper.toDto).not.toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });

    it('should call mapper with entity returned by use case', async () => {
      const createUserDto: CreateUserDto = {
        email: 'another@example.com',
        password: 'SecurePass456!',
      };

      const anotherUser = {
        ...mockUserEntity,
        id: 2,
        email: 'another@example.com',
      };

      createUserUseCase.execute.mockResolvedValue(anotherUser);
      userResponseMapper.toDto.mockReturnValue({
        ...mockUserResponse,
        id: 2,
        email: 'another@example.com',
      });

      await controller.create(createUserDto, mockResponse as Response);

      expect(userResponseMapper.toDto).toHaveBeenCalledWith(anotherUser);
    });
  });
});
