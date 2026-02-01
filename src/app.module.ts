import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ShortUrlModule } from './short-url/short-url.module';

@Module({
  imports: [UserModule, AuthModule, ShortUrlModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
