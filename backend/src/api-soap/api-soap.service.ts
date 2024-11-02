import { BadRequestException, Injectable, InternalServerErrorException, RequestTimeoutException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

import { parseStringPromise } from 'xml2js';
import { lastValueFrom } from 'rxjs';
@Injectable()
export class ApiSoapService {
  constructor(private readonly httpService: HttpService) {}

  async findAll(codigoPais = 'AR'): Promise<{ total: number; provinces: object }> {
    // async findAll(codigoPais = 'AR') { // Linea para forzar fallos comentar la de arriba y hacer true el if linea 21 ( result.geonames.status)
    try {
      // para provincias no encontrada descomentar 14
      // codigoPais='ASDASD'
      const url = `http://api.geonames.org/search?country=${codigoPais}&featureCode=ADM1&username=julianalcaraz`;
      const headers = { Accept: 'application/xml' };
      const timeout = 3000; // limite de espera 3 segundos
      const response = await lastValueFrom(this.httpService.post(url, { headers, timeout }));
      // Parseamos el XML de respuesta a JSON
      const result = await parseStringPromise(response.data); // libreria externa instalada

      // En caso que exista un error en la url o usuario
      if (result.geonames.status) {
        const error = new Error('Error de conexión con el servidor externo. Usuario invalido');
        (error as any).request = true;
        throw error;
      }
      const total = result.geonames.totalResultsCount[0];
      if (total == 0) {
        const provinces = [];
        return { total, provinces };
      }
      const provinces = result.geonames.geoname.filter((prov) => {
        if (prov.fcode[0] === 'ADM1' && prov.countryCode[0] === codigoPais) {
          delete prov.lat;
          delete prov.lng;
          delete prov.geonameId;
          delete prov.fcl;
          delete prov.fcode;
          prov.toponymName = prov.toponymName[0];
          prov.name = prov.name[0];
          prov.countryCode = prov.countryCode[0];
          prov.countryName = prov.countryName[0];
          return true;
        }
        return false;
      });
      return { total, provinces };
    } catch (error) {
      // fallos especificos forzados.
      // throw new RequestTimeoutException('La solicitud al servidor externo tomó demasiado tiempo y fue cancelada. <br> Intentelo nuevamente mas tarde.');
      // throw new InternalServerErrorException(`Error en el servidor externo. <br> Intentelo nuevamente mas tarde.`);
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
