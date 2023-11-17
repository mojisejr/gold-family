import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { DatabaseService } from 'src/database/database.service';
import { Gold } from 'src/interfaces/gold/gold';
import { dateTimeExtranctor } from 'src/util/dateTimeExtractor';

@Injectable()
export class GoldService {
  constructor(private databaseService: DatabaseService) {}
  async scrapeGoldData(): Promise<any> {
    const url = 'https://www.goldtraders.or.th/'; // Replace with the actual URL of the gold price page

    try {
      const response = await axios.get(url);
      const goldData = this.parseGoldData(response.data);
      return goldData;
    } catch (error) {
      throw new Error(`Error scraping gold data: ${error.message}`);
    }
  }

  private parseGoldData(html: string): any {
    const $ = cheerio.load(html);

    // Extracting data from HTML
    const dateTime = dateTimeExtranctor(
      $('#DetailPlace_uc_goldprices1_lblAsTime').text().replace(/,/g, ''),
    );
    const sellPrice = parseFloat(
      $('#DetailPlace_uc_goldprices1_lblBLSell').text().replace(/,/g, ''),
    );
    const buyPrice = parseFloat(
      $('#DetailPlace_uc_goldprices1_lblBLBuy').text().replace(/,/g, ''),
    );
    const ornamentSellPrice = parseFloat(
      $('#DetailPlace_uc_goldprices1_lblOMSell').text().replace(/,/g, ''),
    );
    const ornamentBuyPrice = parseFloat(
      $('#DetailPlace_uc_goldprices1_lblOMBuy').text().replace(/,/g, ''),
    );

    // Creating a JSON object
    const goldObject: Gold = {
      date: dateTime.date,
      time: dateTime.time,
      round: dateTime.round,
      sellPrice,
      buyPrice,
      ornamentSellPrice,
      ornamentBuyPrice,
    };

    return goldObject;
  }

  async isNewGoldRecord(data: Gold) {
    const found = await this.databaseService.findGoldDataByData(data);
    return found == null ? true : false;
  }

  async saveGoldData(data: Gold) {
    //check if has prev data
    const prevGoldData = await this.databaseService.findGoldDataByData({
      ...data,
      round: data.round - 1,
    });

    if (prevGoldData == null) {
      return await this.databaseService.saveGoldData({
        ...data,
        priceChange: '0',
      });
    } else {
      const priceChange = (data.buyPrice - prevGoldData.buyPrice).toString();
      return await this.databaseService.saveGoldData({ ...data, priceChange });
    }
  }
}
