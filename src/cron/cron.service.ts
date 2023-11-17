import { Injectable, Logger } from '@nestjs/common';
import { GoldService } from 'src/gold/gold.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FamilyNotifyService } from 'src/notify/line.service';
import { CurrencyService } from 'src/currency/currency.service';

@Injectable()
export class CronSerivce {
  private readonly logger = new Logger(CronSerivce.name);
  constructor(
    private goldService: GoldService,
    private currencyService: CurrencyService,
    private lineFamilyService: FamilyNotifyService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleGoldData() {
    //1 scrap gold data

    const goldData = await this.goldService.scrapeGoldData();
    //2 check round change
    const isNew = await this.goldService.isNewGoldRecord(goldData);
    if (isNew) {
      console.log('[cron] get new round: ', goldData);
      //3 if new data update database and notify to line group
      const savedData = await this.goldService.saveGoldData(goldData);
      //4 noti
      const currency = await this.currencyService.getUSDTHB();
      await this.lineFamilyService.lineGoldReport(savedData, currency);
    }
    console.log('[cron]: retrived gold data');
  }

  @Cron(CronExpression.EVERY_DAY_AT_5AM)
  async handleCurrencyData() {
    const currency = await this.currencyService.getUSDTHB();
    await this.currencyService.saveCurrency(currency);
    await this.lineFamilyService.lineCurrencyReport(currency);
    console.log('[cron]: currency data saved');
  }
}
