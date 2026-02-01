import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUrl } from 'class-validator';

export class CreateShortUrlDto {
  @ApiProperty({
    example: 'https://exemplo.com/pagina',
    description: 'URL de origem a ser encurtada',
  })
  @IsUrl({}, { message: 'URL inválida' })
  @IsNotEmpty({ message: 'URL é obrigatória' })
  originalUrl: string;
}

/** Entrada do use case: originalUrl + userId (preenchido pelo controller quando autenticado) */
export interface CreateShortUrlInput {
  originalUrl: string;
  userId?: number;
}
