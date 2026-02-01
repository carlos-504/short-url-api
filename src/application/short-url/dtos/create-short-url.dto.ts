import { IsNotEmpty, IsNumber, IsOptional, IsUrl } from 'class-validator';

export class CreateShortUrlDto {
  @IsUrl({}, { message: 'URL inválida' })
  @IsNotEmpty({ message: 'URL é obrigatória' })
  originalUrl: string;

  @IsOptional()
  @IsNumber()
  userId?: number;
}
