import { Injectable, NotFoundException } from '@nestjs/common';
import { Horoscope } from './entity/horoscope.entity';
import { ParamsDto } from './dto/params.dto';
import { translate } from 'bing-translate-api';

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
    const { name, daily, weekly, lucky, lang } = paramsDto;

    let sign = this.zodiac.find(sign => sign.name === name.toLowerCase());
    if (!sign) throw new NotFoundException(`Sign ${name} not found`);

    if (daily) await this.getDailyPrediction(sign);
    if (weekly) await this.getWeeklyPrediction(sign);
    if (lucky && !weekly) await this.getWeeklyPrediction(sign);

    const returnSign = { ...sign }

    if (lang != 'es') {
      returnSign.name = await this.translatePrediction(lang, sign.name);
      if (weekly) returnSign.weekly = await this.translatePrediction(lang, returnSign.weekly);
      if (daily) returnSign.daily = await this.translatePrediction(lang, returnSign.daily);
    }

    delete returnSign.lastUpdatedDaily;
    delete returnSign.lastUpdatedWeekly;
    if (!daily) returnSign.daily = ""
    if (!weekly) returnSign.weekly = ""

    return returnSign;
  }

  private async getDailyPrediction(horoscope: Horoscope): Promise<void> {

    const now = new Date();
    const milisIn24Hours = 24 * 60 * 60 * 1000;

    const diffInMilis = now.getTime() - horoscope.lastUpdatedDaily?.getTime();

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

    horoscope.daily = this.checkSpecialCharacters(textoSinEtiquetas)
      ? "Predicción no disponible en este momento, intentelo mas tarde" : textoSinEtiquetas
    horoscope.lastUpdatedDaily = new Date();

    return;
  }

  private async getWeeklyPrediction(horoscope: Horoscope): Promise<void> {
    const now = new Date()
    const milisInOneWeek = 24 * 60 * 60 * 1000 * 7;

    const diffInMilis = now.getTime() - horoscope.lastUpdatedWeekly?.getTime();

    if (horoscope.weekly != undefined && diffInMilis < milisInOneWeek)
      return;

    const requestPage = await fetch(
      `https://www.lecturas.com/horoscopo/${horoscope.name}`
    );
    let pageText = await requestPage.text();
    let startHoroscope = pageText.indexOf(`<!-- horoscopo Semanal-->`);
    // let startHoroscope = pageText.toLowerCase().indexOf(`${horoscope.name.toLocaleLowerCase()} semanal`);
    let endHoroscope = pageText.indexOf(`número de la`);

    //Eliminamos las etiquetas HTML del texto
    let textoSinEtiquetas = pageText.substring(startHoroscope, endHoroscope + 22)
      .replace(/<[^>]+>|&nbsp;|\r|<|div class=/g, "");


    let startWeekText = textoSinEtiquetas.indexOf(`semanal`);
    let endWeekText = textoSinEtiquetas.indexOf(`número de la`);
    let predictionWeekly = textoSinEtiquetas.substring(startWeekText + 7, endWeekText - 3);
    let lukyNumber = textoSinEtiquetas.substring(endWeekText + 19);

    horoscope.lucky = lukyNumber.replace(/[^\d.]/g, "") != "" ?
      lukyNumber.replace(/[^\d.]/g, "") :
      (Math.floor(Math.random() * 10) + 1).toString();

    //Aseguramos que tenemos una prediccion correcta
    if (horoscope.lucky.length > 2)
      horoscope.lucky = (Math.floor(Math.random() * 10) + 1).toString();

    predictionWeekly = this.checkSpecialCharacters(predictionWeekly)
      ? "Predicción no disponible en este momento, intentelo mas tarde" : predictionWeekly

    horoscope.weekly = predictionWeekly;
    horoscope.lastUpdatedWeekly = new Date();
  }

  private checkSpecialCharacters(texto: string): boolean {
    // Expresión regular para verificar la presencia de cualquiera de los caracteres {}[]/;\ 
    const regex = /[{}\[\]\/;\\]/;

    return regex.test(texto);
  }

  private async translatePrediction(language: string, prediction: string): Promise<string> {
    //This free translator has a maximum length of text is 1000 characters 
    try {
      return (await translate(prediction.substring(0, 999), null, language)).translation;
    } catch (err) {
      console.log(err);
      //return "Error while translate your predicction, Try again on use other language ";
      return prediction;
    }
  }

}
