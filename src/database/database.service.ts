import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { Currency } from 'src/interfaces/currency/currency';
import { Gold } from 'src/interfaces/gold/gold';

const prisma = new PrismaClient();

@Injectable()
export class DatabaseService {
  async saveGoldData(data: Gold) {
    try {
      const created = await prisma.goldData.create({
        data: data,
      });
      return created;
    } catch (error) {
      throw new InternalServerErrorException(
        'DatabaseService[saveGoldData]: cannot create gold data',
      );
    }
  }

  async updateGoldData(data: Gold) {
    try {
      const updated = await prisma.goldData.updateMany({
        data,
        where: {
          date: data.date,
          time: data.time,
          round: data.round,
        },
      });

      if (updated.count < 0) {
        throw new InternalServerErrorException(
          'DatabaseService[updateGoldData]: updated data count = 0',
        );
      }
      return updated;
    } catch (error) {
      throw new InternalServerErrorException(
        'DatabaseService[updateGoldData]: cannot update gold data',
      );
    }
  }

  async findGoldDataByData(data: Gold) {
    try {
      const found = prisma.goldData.findFirst({
        where: {
          date: data.date,
          time: data.time,
          round: data.round,
        },
      });
      return found;
    } catch (error) {
      throw new InternalServerErrorException(
        'DatabaseService[getLatestGVoldData]: cannot get latest gold data',
      );
    }
  }

  async saveCurrencyData(currency: Currency) {
    try {
      const created = await prisma.currency.create({
        data: { ...currency, name: 'usd/thb' },
      });
      return created;
    } catch (error) {
      throw new InternalServerErrorException(
        'DatabaseService[saveCurrencyData]: cannot write currency',
      );
    }
  }
}
