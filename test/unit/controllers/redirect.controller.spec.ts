import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { RedirectController } from '../../../src/presentation/short-url/controllers/redirect.controller';
import { RedirectShortUrlUseCase } from '../../../src/application/short-url';
import {
  mockShortUrlEntity,
  createMockShortUrl,
  createMockResponse,
} from '../../mocks';

describe('RedirectController', () => {
  let controller: RedirectController;
  let redirectShortUrlUseCase: jest.Mocked<RedirectShortUrlUseCase>;
  let mockResponse: Partial<Response>;

  beforeEach(async () => {
    const mockRedirectShortUrlUseCase = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RedirectController],
      providers: [
        {
          provide: RedirectShortUrlUseCase,
          useValue: mockRedirectShortUrlUseCase,
        },
      ],
    }).compile();

    controller = module.get<RedirectController>(RedirectController);
    redirectShortUrlUseCase = module.get(RedirectShortUrlUseCase);

    mockResponse = createMockResponse();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('redirect', () => {
    it('should redirect to original URL with status 302', async () => {
      const shortCode = 'kR3vN2';

      redirectShortUrlUseCase.execute.mockResolvedValue(mockShortUrlEntity);

      await controller.redirect(shortCode, mockResponse as Response);

      expect(redirectShortUrlUseCase.execute).toHaveBeenCalledWith(shortCode);
      expect(redirectShortUrlUseCase.execute).toHaveBeenCalledTimes(1);

      expect(mockResponse.redirect).toHaveBeenCalledWith(
        302,
        'https://example.com/very-long-url',
      );
    });

    it('should propagate error when code is not found', async () => {
      const shortCode = 'invalid';

      const error = new Error('Short URL not found');
      redirectShortUrlUseCase.execute.mockRejectedValue(error);

      await expect(
        controller.redirect(shortCode, mockResponse as Response),
      ).rejects.toThrow(error);

      expect(redirectShortUrlUseCase.execute).toHaveBeenCalledWith(shortCode);
      expect(mockResponse.redirect).not.toHaveBeenCalled();
    });

    it('should increment clicks when redirecting', async () => {
      const shortCode = 'xyz789';
      const entityWithMoreClicks = createMockShortUrl({
        shortCode: 'xyz789',
        clicks: BigInt(100),
      });

      redirectShortUrlUseCase.execute.mockResolvedValue(entityWithMoreClicks);

      await controller.redirect(shortCode, mockResponse as Response);

      expect(redirectShortUrlUseCase.execute).toHaveBeenCalledWith(shortCode);
      expect(mockResponse.redirect).toHaveBeenCalledWith(
        302,
        entityWithMoreClicks.originalUrl,
      );
    });

    it('should redirect URLs without associated user', async () => {
      const shortCode = 'public1';
      const publicEntity = createMockShortUrl({
        shortCode: 'public1',
        userId: null,
        originalUrl: 'https://public-url.com',
      });

      redirectShortUrlUseCase.execute.mockResolvedValue(publicEntity);

      await controller.redirect(shortCode, mockResponse as Response);

      expect(redirectShortUrlUseCase.execute).toHaveBeenCalledWith(shortCode);
      expect(mockResponse.redirect).toHaveBeenCalledWith(
        302,
        'https://public-url.com',
      );
    });

    it('should accept hashids codes of different lengths (1-6 chars)', async () => {
      const testCases = ['a', 'ab', 'kR3', 'kR3v', 'kR3vN', 'kR3vN2'];

      for (const code of testCases) {
        const entity = createMockShortUrl({
          shortCode: code,
          originalUrl: `https://example.com/${code}`,
        });

        redirectShortUrlUseCase.execute.mockResolvedValue(entity);

        await controller.redirect(code, mockResponse as Response);

        expect(redirectShortUrlUseCase.execute).toHaveBeenCalledWith(code);
        expect(mockResponse.redirect).toHaveBeenCalledWith(
          302,
          `https://example.com/${code}`,
        );

        jest.clearAllMocks();
      }
    });
  });
});
