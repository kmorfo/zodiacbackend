import { Controller, Get, Param } from '@nestjs/common';
import { HoroscopeService } from './horoscope.service';
import { Horoscope } from './entity/horoscope.entity';


@Controller('horoscope')
export class HoroscopeController {
  constructor(private readonly horoscopeService: HoroscopeService) { }

  @Get()
  findAll(): Horoscope[] {
    return this.horoscopeService.findAll();
  }

  @Get(':sign')
  findOne(@Param('sign') sign: string) {
    return this.horoscopeService.findOne(sign);
  }

}
