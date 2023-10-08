import { Module } from '@nestjs/common';
import { HoroscopeModule } from './horoscope/horoscope.module';


@Module({
  imports: [HoroscopeModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
