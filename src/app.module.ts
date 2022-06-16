import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.model';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { BookModule } from './book/book.module';
import { Book } from './book/book.model';
import { CartModule } from './cart/cart.module';
import { CartbooksModule } from './cartbooks/cartbooks.module';
import { Cart } from './cart/cart.model';
import { CartBooks } from './cartbooks/cartbooks.model';
import { AmocrmModule } from './integrations/amocrm/amocrm.module';
import { InsalesModule } from './integrations/insales/insales.module';
import { SettingIntegrationAmoCrm } from './integrations/amocrm/settings.model';
import { UpdateTokenAmoCrmCommand } from './commands/update-token-amocrm.command';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`
  }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [User, Book, Cart, CartBooks, SettingIntegrationAmoCrm],
      migrations: [],
      keepConnectionAlive: true
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    BookModule,
    CartModule,
    CartbooksModule,
    AmocrmModule,
    InsalesModule
],
  providers: [UpdateTokenAmoCrmCommand],
})
export class AppModule {}
