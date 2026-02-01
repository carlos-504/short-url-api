import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUrl } from 'class-validator';

export class UpdateShortUrlDto {
  @ApiProperty({
    example: 'https://nova-url.com/destino',
    description: 'Nova URL de destino',
  })
  @IsUrl({}, { message: 'URL inválida' })
  @IsNotEmpty({ message: 'URL é obrigatória' })
  originalUrl: string;
}
