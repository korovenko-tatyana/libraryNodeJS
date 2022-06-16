import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { CartModule } from '../cart/cart.module';
import { BookController } from './book.controller';
import { Book } from './book.model';
import { BookService } from './book.service';

@Module({
  controllers: [BookController],
  providers: [BookService],
  imports: [
    TypeOrmModule.forFeature([Book]),
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
    forwardRef(() => CartModule)
  ],
  exports: [BookService]
})
export class BookModule {}
