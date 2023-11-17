import { Injectable, Logger } from '@nestjs/common';
import { GoldService } from 'src/gold/gold.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FamilyNotifyService } from 'src/notify/line.service';

@Injectable()
export class CronSerivce {
  private readonly logger = new Logger(CronSerivce.name);
  constructor(
    private goldService: GoldService,
    private lineFamilyService: FamilyNotifyService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    //1 scrap gold data
    const goldData = await this.goldService.scrapeGoldData();
    //2 check round change
    const isNew = await this.goldService.isNewGoldRecord(goldData);
    if (isNew) {
      console.log('[cron] get new round: ', goldData);
      //3 if new data update database and notify to line group
      await this.goldService.saveGoldData(goldData);
      await this.lineFamilyService.lineFamilyNotify(goldData);
    }
    console.log('[cron]: retrived gold data');
  }
}
