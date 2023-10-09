import { Module } from '@nestjs/common';
import { HoroscopeModule } from './horoscope/horoscope.module';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    ConfigModule.forRoot(),
    HoroscopeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
