import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { Gold } from 'src/interfaces/gold/gold';
import { parseThaiDate } from 'src/util/parseThaiDate';

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
        'DatabaseService[getLatestGoldData]: cannot get latest gold data',
      );
    }
  }
}
