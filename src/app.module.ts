import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ShortUrlModule } from './short-url/short-url.module';

@Module({
  imports: [UserModule, ShortUrlModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
