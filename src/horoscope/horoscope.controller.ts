import { Controller, Get, Query } from '@nestjs/common';
import { HoroscopeService } from './horoscope.service';
import { ParamsDto } from './dto/params.dto';

@Controller('horoscope')
export class HoroscopeController {
  constructor(private readonly horoscopeService: HoroscopeService) { }


  @Get()
  findOne(@Query() paramsDto: ParamsDto) {
    return this.horoscopeService.findOne(paramsDto);
  }

}
