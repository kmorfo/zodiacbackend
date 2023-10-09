import { Controller, Get, Query } from '@nestjs/common';
import { HoroscopeService } from './horoscope.service';
import { ParamsDto } from './dto/params.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Horoscope } from './entity/horoscope.entity';

@ApiTags("Horoscope")
@Controller('horoscope')
export class HoroscopeController {
  constructor(private readonly horoscopeService: HoroscopeService) { }

  @Get()
  @ApiResponse({ status: 200, description: 'Return the zodiac sign request', type: Horoscope })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Sign not found' })
  findOne(@Query() paramsDto: ParamsDto) {
    return this.horoscopeService.findOne(paramsDto);
  }

}
