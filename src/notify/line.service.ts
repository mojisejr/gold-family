import axios from 'axios';
import * as qs from 'qs';
import { Gold } from 'src/interfaces/gold/gold';
import { Injectable } from '@nestjs/common';
import { Currency } from '../interfaces/currency/currency';

@Injectable()
export class FamilyNotifyService {
  async lineGoldReport(data: Gold, currency?: Currency) {
    const message = this.createGoldReport(data, currency);
    try {
      await this.sendingData(message);
      return true;
    } catch (error: any) {
      console.log(error);
    }
  }

  async lineCurrencyReport(currency?: Currency) {
    const message = this.createCurrencyReport(currency);
    try {
      await this.sendingData(message);
      return true;
    } catch (error: any) {
      console.log(error);
    }
  }

  private createCurrencyReport = (currency: Currency) => {
    let message = '';
    message = `
    วัน: เวลา ${currency.timestamp}
    บาทต่อดอลล่า(USD/THB): ${currency.rate} บาท/ดอลล่า`;
    return message;
  };

  private createGoldReport = (data: Gold, currency: Currency) => {
    let message = '';
    message = `
    วันที่ ${data.date}: ${data.time} รอบที่ ${data.round}
    ไปซื้อได้บาทละ : ${data.sellPrice} บาท
    ไปขายได้บาทละ : ${data.buyPrice} บาท
    ราคาเปลี่ยนจากรอบที่แล้ว : ${data.priceChange} บาท
    --
    บาทต่อดอลล่า(USD/THB): ${currency.rate} บาท/ดอลล่า`;
    return message;
  };

  private sendingData = async (message: string) => {
    const token = process.env.line_family_key as string;
    const data = qs.stringify({ message });
    const response = await axios.post(process.env.line_uri as string, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        ContentType: 'application/x-www-form-urlencoded',
      },
    });
  };
}
