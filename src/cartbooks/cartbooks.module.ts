import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { BookModule } from '../book/book.module';
import { CartModule } from '../cart/cart.module';
import { CartbooksController } from './cartbooks.controller';
import { CartBooks } from './cartbooks.model';
import { CartbooksService } from './cartbooks.service';

@Module({
  controllers: [CartbooksController],
  providers: [CartbooksService],
  imports: [
    TypeOrmModule.forFeature([CartBooks]),
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`
  }),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY,
      signOptions: { 
        expiresIn: '1h' 
      },
    }),
    forwardRef(() => CartModule),
    BookModule
  ],
  exports: [CartbooksService]
})
export class CartbooksModule {}
