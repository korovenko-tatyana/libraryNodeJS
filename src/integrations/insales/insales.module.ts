import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { InsalesService } from './insales.service';
import { InsalesController } from './insales.controller';

@Module({
  controllers: [SettingsController, InsalesController],
  providers: [InsalesService]
})
export class InsalesModule {}
