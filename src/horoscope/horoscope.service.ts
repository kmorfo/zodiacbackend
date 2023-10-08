import { Injectable, NotFoundException } from '@nestjs/common';
import { Horoscope } from './entity/horoscope.entity';


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


  async findOne(id: string): Promise<Horoscope> {
    let sign = this.zodiac.find(sign => sign.name === id)
    if (!sign) throw new NotFoundException(`Sign ${id} not found`)

    sign = await this.getPrediction(sign)

    return sign
  }

  findAll(): Horoscope[] {
    return this.zodiac
  }

  private async getPrediction(sign: Horoscope): Promise<Horoscope> {
    const now = new Date();
    // Define the number of milisegundos in 24 hours
    const milisIn24Hours = 24 * 60 * 60 * 1000;
    const diffInMilis = now.getTime() - sign.lastUpdated?.getTime() ?? 0

    if (!sign.prediction || diffInMilis > milisIn24Hours) {
      sign.prediction = await this.getLecturasPrediction(sign.name);
      sign.lastUpdated = new Date()
      return sign;
    }

    return sign;
  }

  private async getLecturasPrediction(horoscope: string): Promise<string> {
    const requestPage = await fetch(
      `https://www.lecturas.com/horoscopo/${horoscope}`
    );
    let pageText = await requestPage.text();
    let startHoroscope = pageText.indexOf(`<div class="txt">`);
    let endHoroscope = pageText.indexOf(`<div class="social-links">`);

    //Eliminamos las etiquetas HTML del texto
    let prediction = pageText.substring(startHoroscope, endHoroscope);
    let textoSinEtiquetas = prediction.replace(/<[^>]+>/g, "");
    textoSinEtiquetas = textoSinEtiquetas.replace(/&nbsp;/g, "");
    textoSinEtiquetas = textoSinEtiquetas.replace(/\r/g, "");
    console.log(textoSinEtiquetas);

    return textoSinEtiquetas;
  }


}
