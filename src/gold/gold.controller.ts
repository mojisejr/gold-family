import { Controller, Get } from '@nestjs/common';
import { GoldService } from './gold.service';

@Controller('gold')
export class GoldController {
  constructor(private readonly goldService: GoldService) {}

  @Get()
  async getGoldData(): Promise<any> {
    return this.goldService.scrapeGoldData();
  }
}
