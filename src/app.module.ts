import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { ShortUrlModule } from './modules/short-url/short-url.module';

@Module({
  imports: [UserModule, ShortUrlModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
