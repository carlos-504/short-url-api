import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ShortUrlController } from '../../../src/presentation/short-url/controllers/short-url.controller';
import {
  CreateShortUrlUseCase,
  ListShortUrlsUseCase,
  UpdateShortUrlUseCase,
  DeleteShortUrlUseCase,
  CreateShortUrlDto,
  UpdateShortUrlDto,
  ShortUrlResponseMapper,
} from '../../../src/application/short-url';
import type { ShortUrlEntity } from '../../../src/domain/short-url';
import {
  mockShortUrlEntity,
  mockShortUrlResponse,
  createMockShortUrl,
  createMockResponse,
} from '../../mocks';

describe('ShortUrlController', () => {
  let controller: ShortUrlController;
  let createShortUrlUseCase: jest.Mocked<CreateShortUrlUseCase>;
  let listShortUrlsUseCase: jest.Mocked<ListShortUrlsUseCase>;
  let updateShortUrlUseCase: jest.Mocked<UpdateShortUrlUseCase>;
  let deleteShortUrlUseCase: jest.Mocked<DeleteShortUrlUseCase>;
  let shortUrlResponseMapper: jest.Mocked<ShortUrlResponseMapper>;
  let mockResponse: Partial<Response>;

  beforeEach(async () => {
    const mockCreateShortUrlUseCase = {
      execute: jest.fn(),
    };

    const mockListShortUrlsUseCase = {
      execute: jest.fn(),
    };

    const mockUpdateShortUrlUseCase = {
      execute: jest.fn(),
    };

    const mockDeleteShortUrlUseCase = {
      execute: jest.fn(),
    };

    const mockShortUrlResponseMapper = {
      toDto: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShortUrlController],
      providers: [
        {
          provide: CreateShortUrlUseCase,
          useValue: mockCreateShortUrlUseCase,
        },
        {
          provide: ListShortUrlsUseCase,
          useValue: mockListShortUrlsUseCase,
        },
        {
          provide: UpdateShortUrlUseCase,
          useValue: mockUpdateShortUrlUseCase,
        },
        {
          provide: DeleteShortUrlUseCase,
          useValue: mockDeleteShortUrlUseCase,
        },
        {
          provide: ShortUrlResponseMapper,
          useValue: mockShortUrlResponseMapper,
        },
      ],
    }).compile();

    controller = module.get<ShortUrlController>(ShortUrlController);
    createShortUrlUseCase = module.get(CreateShortUrlUseCase);
    listShortUrlsUseCase = module.get(ListShortUrlsUseCase);
    updateShortUrlUseCase = module.get(UpdateShortUrlUseCase);
    deleteShortUrlUseCase = module.get(DeleteShortUrlUseCase);
    shortUrlResponseMapper = module.get(ShortUrlResponseMapper);

    mockResponse = createMockResponse();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('deve criar URL encurtada sem usuário autenticado', async () => {
      const dto: CreateShortUrlDto = {
        originalUrl: 'https://example.com/very-long-url',
      };

      const entityWithoutUser = createMockShortUrl({ userId: null });
      const responseWithoutUser = { ...mockShortUrlResponse, userId: null };

      createShortUrlUseCase.execute.mockResolvedValue(entityWithoutUser);
      shortUrlResponseMapper.toDto.mockReturnValue(responseWithoutUser);

      await controller.create(dto, mockResponse as Response, undefined);

      expect(createShortUrlUseCase.execute).toHaveBeenCalledWith({
        originalUrl: dto.originalUrl,
        userId: undefined,
      });

      expect(shortUrlResponseMapper.toDto).toHaveBeenCalledWith(
        entityWithoutUser,
        'http://localhost:3000',
      );

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'URL encurtada criada com sucesso',
        data: responseWithoutUser,
      });
    });

    it('deve criar URL encurtada com usuário autenticado', async () => {
      const dto: CreateShortUrlDto = {
        originalUrl: 'https://example.com/very-long-url',
      };

      createShortUrlUseCase.execute.mockResolvedValue(mockShortUrlEntity);
      shortUrlResponseMapper.toDto.mockReturnValue(mockShortUrlResponse);

      await controller.create(dto, mockResponse as Response, 1);

      expect(createShortUrlUseCase.execute).toHaveBeenCalledWith({
        originalUrl: dto.originalUrl,
        userId: 1,
      });

      expect(shortUrlResponseMapper.toDto).toHaveBeenCalledWith(
        mockShortUrlEntity,
        'http://localhost:3000',
      );

      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'URL encurtada criada com sucesso',
        data: mockShortUrlResponse,
      });
    });

    it('deve propagar erro quando o use case falhar', async () => {
      const dto: CreateShortUrlDto = {
        originalUrl: 'https://example.com/test',
      };

      const error = new Error('Não foi possível gerar código único');
      createShortUrlUseCase.execute.mockRejectedValue(error);

      await expect(
        controller.create(dto, mockResponse as Response, 1),
      ).rejects.toThrow(error);

      expect(shortUrlResponseMapper.toDto).not.toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });
  });

  describe('list', () => {
    it('deve listar URLs do usuário autenticado', async () => {
      const mockList: ShortUrlEntity[] = [
        mockShortUrlEntity,
        createMockShortUrl({
          id: 2,
          shortCode: 'xyz789',
          clicks: BigInt(5),
        }),
      ];

      const mockResponseList = [
        mockShortUrlResponse,
        {
          ...mockShortUrlResponse,
          id: 2,
          shortCode: 'xyz789',
          clicks: '5',
        },
      ];

      listShortUrlsUseCase.execute.mockResolvedValue(mockList);
      shortUrlResponseMapper.toDto
        .mockReturnValueOnce(mockResponseList[0])
        .mockReturnValueOnce(mockResponseList[1]);

      await controller.list(mockResponse as Response, 1);

      expect(listShortUrlsUseCase.execute).toHaveBeenCalledWith(1);
      expect(shortUrlResponseMapper.toDto).toHaveBeenCalledTimes(2);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        data: mockResponseList,
      });
    });

    it('deve retornar lista vazia quando usuário não tiver URLs', async () => {
      listShortUrlsUseCase.execute.mockResolvedValue([]);

      await controller.list(mockResponse as Response, 1);

      expect(listShortUrlsUseCase.execute).toHaveBeenCalledWith(1);
      expect(shortUrlResponseMapper.toDto).not.toHaveBeenCalled();

      expect(mockResponse.json).toHaveBeenCalledWith({
        data: [],
      });
    });
  });

  describe('update', () => {
    it('deve atualizar URL de destino com sucesso', async () => {
      const dto: UpdateShortUrlDto = {
        originalUrl: 'https://example.com/new-url',
      };

      const updatedEntity = createMockShortUrl({
        originalUrl: dto.originalUrl,
        updatedAt: new Date('2024-01-02T00:00:00.000Z'),
      });

      const updatedResponse = {
        ...mockShortUrlResponse,
        originalUrl: dto.originalUrl,
      };

      updateShortUrlUseCase.execute.mockResolvedValue(updatedEntity);
      shortUrlResponseMapper.toDto.mockReturnValue(updatedResponse);

      await controller.update(1, dto, mockResponse as Response, 1);

      expect(updateShortUrlUseCase.execute).toHaveBeenCalledWith(1, dto, 1);

      expect(shortUrlResponseMapper.toDto).toHaveBeenCalledWith(
        updatedEntity,
        'http://localhost:3000',
      );

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'URL de destino atualizada com sucesso',
        data: updatedResponse,
      });
    });

    it('deve propagar erro quando URL não pertencer ao usuário', async () => {
      const dto: UpdateShortUrlDto = {
        originalUrl: 'https://example.com/new-url',
      };

      const error = new Error('URL não encontrada ou sem permissão');
      updateShortUrlUseCase.execute.mockRejectedValue(error);

      await expect(
        controller.update(1, dto, mockResponse as Response, 1),
      ).rejects.toThrow(error);

      expect(shortUrlResponseMapper.toDto).not.toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('deve excluir URL encurtada com sucesso', async () => {
      deleteShortUrlUseCase.execute.mockResolvedValue(undefined);

      await controller.delete(1, mockResponse as Response, 1);

      expect(deleteShortUrlUseCase.execute).toHaveBeenCalledWith(1, 1);
      expect(deleteShortUrlUseCase.execute).toHaveBeenCalledTimes(1);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NO_CONTENT);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'URL encurtada excluída com sucesso',
      });
    });

    it('deve propagar erro quando URL não pertencer ao usuário', async () => {
      const error = new Error('URL não encontrada ou sem permissão');
      deleteShortUrlUseCase.execute.mockRejectedValue(error);

      await expect(
        controller.delete(1, mockResponse as Response, 1),
      ).rejects.toThrow(error);

      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });

    it('deve chamar use case com IDs corretos', async () => {
      deleteShortUrlUseCase.execute.mockResolvedValue(undefined);

      await controller.delete(42, mockResponse as Response, 10);

      expect(deleteShortUrlUseCase.execute).toHaveBeenCalledWith(42, 10);
    });
  });
});
