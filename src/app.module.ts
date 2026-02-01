import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ShortUrlModule } from './modules/short-url/short-url.module';

@Module({
  imports: [UserModule, AuthModule, ShortUrlModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
