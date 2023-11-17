import { Injectable } from '@nestjs/common';
import { Currency } from '@prisma/client';
import axios from 'axios';
import { DatabaseService } from 'src/database/database.service';
import { getFormattedDate } from 'src/util/parseThaiDate';

@Injectable()
export class CurrencyService {
  constructor(private databaseService: DatabaseService) {}
  private url =
    'https://apigw1.bot.or.th/bot/public/Stat-ReferenceRate/v2/DAILY_REF_RATE/';

  private getUrl() {
    const currentDate = getFormattedDate(new Date());
    return `${this.url}/?start_period=${currentDate}&end_period=${currentDate}`;
  }

  async getUSDTHB() {
    const url = this.getUrl();
    const usdthb = await axios({
      url,
      method: 'GET',
      headers: {
        'X-IBM-Client-Id': process.env.thai_bank_client_id,
        accept: 'application/json',
      },
    });

    const result = usdthb.data;

    return {
      timestamp: result.result.timestamp,
      period: result.result.data.data_detail[0].period,
      rate: +result.result.data.data_detail[0].rate,
    } as Currency;
  }

  async saveCurrency(currency: Currency) {
    return await this.databaseService.saveCurrencyData(currency);
  }
}
