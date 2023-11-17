import axios from 'axios';
import * as qs from 'qs';
import { Gold } from 'src/interfaces/gold/gold';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FamilyNotifyService {
  async lineFamilyNotify(data: Gold) {
    const message = this.createNotificationMessage(data);
    try {
      const token = process.env.line_family_key as string;
      const data = qs.stringify({ message });
      const response = await axios.post(process.env.line_uri as string, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          ContentType: 'application/x-www-form-urlencoded',
        },
      });

      return true;
    } catch (error: any) {
      console.log(error);
    }
  }

  createNotificationMessage = (data: Gold) => {
    let message = '';
    message = `
    วันที่ ${data.date}: ${data.time} รอบที่ ${data.round}
    ไปซื้อได้บาทละ : ${data.sellPrice} บาท
    ไปขายได้บาทละ : ${data.buyPrice} บาท
    ราคาเปลี่ยนจากรอบที่แล้ว : ${data.priceChange} บาท`;
    return message;
  };
}
