import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

import { parseStringPromise } from 'xml2js';
import { lastValueFrom } from 'rxjs';
@Injectable()
export class ApiSoapService {
  constructor(private readonly httpService: HttpService) {}
  // la idea es que venga el codigo pais
  async findAll(codigoPais = 'AR'): Promise<{ total: number; provinces: object }> {
    try {
      // const codigoPais = 'AR' | 'CL';
      const url = `http://api.geonames.org/search?country=${codigoPais}&featureCode=ADM1&username=julianalcaraz`;
      const headers = { Accept: 'application/xml' };
      const timeout = 10000;
      const response = await lastValueFrom(this.httpService.get(url, { headers, timeout }));

      // Parseamos el XML de respuesta a JSON
      const result = await parseStringPromise(response.data);
      const total = result.geonames.totalResultsCount[0];

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
          return true; // Solo devuelve el objeto si cumple la condición
        }
        return false; // Filtra los que no cumplen
      });
      return { total, provinces }; // Devolvemos el JSON resultante
    } catch (error) {
      // console.log('EROROROROROR', error.cause);
      // throw new Error(`Error fetching data from XML service: ${error.message}`);
      throw new Error(`ERORR TRAYENDO LA DATA XML: ${error.message}`);
    }
  }
}
