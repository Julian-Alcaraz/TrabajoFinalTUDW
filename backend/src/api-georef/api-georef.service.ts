import { BadRequestException, Injectable, InternalServerErrorException, RequestTimeoutException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ApiGeorefService {
  constructor(private readonly httpService: HttpService) {}

  async obtenerLocalidades(provincia) {
    // provincia='asdasdas' // para que no devuelva profincias
    // const url = `https://pis.datos.gob.ar/georef/api/localidades?provincia=' + provincia + '&campos=nombre&max=100&exacto=true&formato=json`; // error de servicio externo usar esta url
    // const url = `https://apis.datos.gob.ar/georef/api/localidades?provincia=' + provincia + '&campos=nombre&ma=100&exacto=true&formato=json`; // error de datos usar esta url
    const url = 'https://apis.datos.gob.ar/georef/api/localidades?provincia=' + provincia + '&campos=nombre&max=100&exacto=true&formato=json';
    try {
      const { data } = await lastValueFrom(this.httpService.get(url, { timeout: 1500 })); // poner en 1 para error de timeout
      return data;
    } catch (error) {
      if (error.code === 'ENOTFOUND') {
        throw new InternalServerErrorException('Error de conexión con el servidor externo.');
      }
      if (error.code === 'ECONNABORTED') {
        throw new RequestTimeoutException('La solicitud al servidor externo tomó demasiado tiempo y fue cancelada. <br> Intentelo nuevamente mas tarde.');
      } else if (error.response) {
        const statusCode = error.response.status;
        if (statusCode >= 400 && statusCode < 500) {
          throw new BadRequestException(`Error en la solicitud. Verifica los datos.`);
        } else if (statusCode >= 500) {
          throw new InternalServerErrorException(`Error en el servidor externo. <br> Intentelo nuevamente mas tarde.`);
        }
      } else if (error.request) {
        throw new InternalServerErrorException('Error de conexión con el servidor externo.');
      } else {
        throw new InternalServerErrorException(`Error inesperado.`);
      }
    }
  }
}
