import { Module } from '@nestjs/common';
import { GoldService } from './gold/gold.service';
import { GoldController } from './gold/gold.controller';
import { CronSerivce } from './cron/cron.service';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseService } from './database/database.service';
import { FamilyNotifyService } from './notify/line.service';
import { CurrencyService } from './currency/currency.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [GoldController],
  providers: [
    GoldService,
    CronSerivce,
    DatabaseService,
    FamilyNotifyService,
    CurrencyService,
  ],
})
export class AppModule {}
