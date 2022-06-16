import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { AmocrmService } from './amocrm.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingIntegrationAmoCrm } from './settings.model';
import { AuthModule } from '../../auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
    controllers: [SettingsController],
    providers: [AmocrmService],
    imports: [
        TypeOrmModule.forFeature([SettingIntegrationAmoCrm]),
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
      ],
    exports: [AmocrmModule, AmocrmService]
})
export class AmocrmModule {}
