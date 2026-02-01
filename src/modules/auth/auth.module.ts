import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { LoginUseCase } from '../../application/auth/use-cases/login.use-case';
import { AuthController } from '../../presentation/auth/controllers/auth.controller';
import { JwtStrategy } from '../../presentation/auth/strategies/jwt.strategy';

@Module({
  imports: [
    UserModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [LoginUseCase, JwtStrategy],
})
export class AuthModule {}
