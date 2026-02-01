import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { AuthController } from '../../../src/presentation/auth/controllers/auth.controller';
import { LoginUseCase } from '../../../src/application/auth/use-cases/login.use-case';
import { LoginDto } from '../../../src/application/auth/dtos/login.dto';
import { createMockResponse } from '../../mocks';

describe('AuthController', () => {
  let controller: AuthController;
  let loginUseCase: jest.Mocked<LoginUseCase>;
  let jwtService: jest.Mocked<JwtService>;
  let mockResponse: Partial<Response>;

  const mockLoginResult = {
    userId: 1,
    email: 'test@example.com',
  };

  const mockAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.token';

  beforeEach(async () => {
    const mockLoginUseCase = {
      execute: jest.fn(),
    };

    const mockJwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: LoginUseCase,
          useValue: mockLoginUseCase,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    loginUseCase = module.get(LoginUseCase);
    jwtService = module.get(JwtService);

    mockResponse = createMockResponse();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('deve realizar login com sucesso e retornar accessToken', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'Password123!',
      };

      loginUseCase.execute.mockResolvedValue(mockLoginResult);
      jwtService.sign.mockReturnValue(mockAccessToken);

      await controller.login(loginDto, mockResponse as Response);

      expect(loginUseCase.execute).toHaveBeenCalledWith(loginDto);
      expect(loginUseCase.execute).toHaveBeenCalledTimes(1);

      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: '1',
        email: 'test@example.com',
      });
      expect(jwtService.sign).toHaveBeenCalledTimes(1);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        accessToken: mockAccessToken,
        user: {
          id: 1,
          email: 'test@example.com',
        },
      });
    });

    it('deve propagar erro quando credenciais forem inválidas', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrongPassword',
      };

      const error = new Error('Credenciais inválidas');
      loginUseCase.execute.mockRejectedValue(error);

      await expect(
        controller.login(loginDto, mockResponse as Response),
      ).rejects.toThrow(error);

      expect(loginUseCase.execute).toHaveBeenCalledWith(loginDto);
      expect(jwtService.sign).not.toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });

    it('deve gerar token JWT com payload correto', async () => {
      const loginDto: LoginDto = {
        email: 'another@example.com',
        password: 'SecurePass456!',
      };

      const anotherUser = {
        userId: 42,
        email: 'another@example.com',
      };

      loginUseCase.execute.mockResolvedValue(anotherUser);
      jwtService.sign.mockReturnValue('another.jwt.token');

      await controller.login(loginDto, mockResponse as Response);

      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: '42',
        email: 'another@example.com',
      });

      expect(mockResponse.json).toHaveBeenCalledWith({
        accessToken: 'another.jwt.token',
        user: {
          id: 42,
          email: 'another@example.com',
        },
      });
    });

    it('deve converter userId para string no payload do JWT', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'Password123!',
      };

      loginUseCase.execute.mockResolvedValue(mockLoginResult);
      jwtService.sign.mockReturnValue(mockAccessToken);

      await controller.login(loginDto, mockResponse as Response);

      const signCall = jwtService.sign.mock.calls[0][0];
      expect(typeof (signCall as any).sub).toBe('string');
      expect((signCall as any).sub).toBe('1');
    });
  });
});
