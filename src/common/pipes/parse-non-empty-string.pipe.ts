import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseNonEmptyStringPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    if (value == null || typeof value !== 'string' || !value.trim()) {
      throw new BadRequestException('Código é obrigatório');
    }
    return value.trim();
  }
}
