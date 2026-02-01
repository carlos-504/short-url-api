import { IsNotEmpty, IsUrl } from 'class-validator';

export class UpdateShortUrlDto {
  @IsUrl({}, { message: 'URL inválida' })
  @IsNotEmpty({ message: 'URL é obrigatória' })
  originalUrl: string;
}
