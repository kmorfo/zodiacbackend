import { Injectable, NotFoundException } from '@nestjs/common';
import { Horoscope } from './entity/horoscope.entity';
import { ParamsDto } from './dto/params.dto';


@Injectable()
export class HoroscopeService {

  private zodiac: Horoscope[] = [
    { name: "aries" },
    { name: "tauro" },
    { name: "geminis" },
    { name: "cancer" },
    { name: "leo" },
    { name: "virgo" },
    { name: "libra" },
    { name: "escorpio" },
    { name: "sagitario" },
    { name: "capricornio" },
    { name: "acuario" },
    { name: "piscis" }
  ]


  async findOne(paramsDto: ParamsDto): Promise<Horoscope> {
    const { name, daily, weelky } = paramsDto;

    let sign = this.zodiac.find(sign => sign.name === name)
    if (!sign) throw new NotFoundException(`Sign ${name} not found`)

    if (daily) await this.getDailyPrediction(sign);
    if (weelky) await this.getWeeklyPrediction(sign);

    const returnSign = { ...sign }
    delete returnSign.lastUpdatedDaily
    delete returnSign.lastUpdatedWeekly
    if (!daily) delete returnSign.daily
    if (!weelky) delete returnSign.weekly

    return returnSign;
  }


  private async getDailyPrediction(horoscope: Horoscope): Promise<void> {
    const now = new Date()
    const milisIn24Hours = 24 * 60 * 60 * 1000;

    const diffInMilis = now.getTime() - horoscope.lastUpdatedDaily?.getTime() ?? 0;

    if (horoscope.daily != undefined && diffInMilis < milisIn24Hours)
      return;

    const requestPage = await fetch(
      `https://www.lecturas.com/horoscopo/${horoscope.name}`
    );
    let pageText = await requestPage.text();
    let startHoroscope = pageText.indexOf(`<div class="txt">`);
    let endHoroscope = pageText.indexOf(`<div class="social-links">`);

    //Eliminamos las etiquetas HTML del texto
    let prediction = pageText.substring(startHoroscope, endHoroscope);
    let textoSinEtiquetas = prediction.replace(/<[^>]+>/g, "");
    textoSinEtiquetas = textoSinEtiquetas.replace(/&nbsp;/g, "");
    textoSinEtiquetas = textoSinEtiquetas.replace(/\r/g, "");

    horoscope.daily = textoSinEtiquetas;
    horoscope.lastUpdatedDaily = new Date()
    return;
  }

  private async getWeeklyPrediction(horoscope: Horoscope): Promise<void> {
    const now = new Date()
    const milisInOneWeek = 24 * 60 * 60 * 1000 * 7;

    const diffInMilis = now.getTime() - horoscope.lastUpdatedWeekly?.getTime() ?? 0;

    if (horoscope.weekly != undefined && diffInMilis < milisInOneWeek)
      return;

    const requestPage = await fetch(
      `https://www.lecturas.com/horoscopo/${horoscope.name}`
    );
    let pageText = await requestPage.text();
    let startHoroscope = pageText.indexOf(`<!-- horoscopo Semanal-->`);
    let endHoroscope = pageText.indexOf(`Tu número de la suerte`);

    //Eliminamos las etiquetas HTML del texto
    let prediction = pageText.substring(startHoroscope, endHoroscope + 25);
    let textoSinEtiquetas = prediction.replace(/<[^>]+>/g, "");
    textoSinEtiquetas = textoSinEtiquetas.replace(/&nbsp;/g, "");
    textoSinEtiquetas = textoSinEtiquetas.replace(/\r/g, "");

    let startWeekText = textoSinEtiquetas.indexOf(`semanal`);
    let predictionWeekly = textoSinEtiquetas.substring(startWeekText + 7);

    horoscope.weekly = predictionWeekly;
    horoscope.lastUpdatedWeekly = new Date();
  }


}
