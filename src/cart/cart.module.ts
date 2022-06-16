import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { CartbooksModule } from '../cartbooks/cartbooks.module';
import { User } from '../user/user.model';
import { UserModule } from '../user/user.module';
import { CartController } from './cart.controller';
import { Cart } from './cart.model';
import { CartService } from './cart.service';
import { Book } from '../book/book.model';
import { CartBooks } from '../cartbooks/cartbooks.model';
import { BookService } from '../book/book.service';
import { BookModule } from '../book/book.module';

@Module({
  controllers: [CartController],
  providers: [CartService],
  imports: [
    TypeOrmModule.forFeature([Cart, User, Book, CartBooks]),
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
    forwardRef(() => CartbooksModule),
    forwardRef(() => UserModule),
    forwardRef(() => BookModule)
  ],
  exports: [CartService]
})
export class CartModule {}
