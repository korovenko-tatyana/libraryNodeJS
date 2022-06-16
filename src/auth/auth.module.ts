import { forwardRef, Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { JwtAuthGuard } from './jwt-auth.guard';


@Module({
  controllers: [AuthController],
  imports: [
      forwardRef(() => UserModule), 
      PassportModule,
      ConfigModule.forRoot({
        envFilePath: `.${process.env.NODE_ENV}.env`
    }),
      JwtModule.register({
        secret: process.env.PRIVATE_KEY,
        signOptions: { 
          expiresIn: '1h' 
        },
      }),
  ],
  providers: [AuthService, LocalStrategy, JwtAuthGuard],
  exports: [AuthService, JwtAuthGuard]
})
export class AuthModule {}
