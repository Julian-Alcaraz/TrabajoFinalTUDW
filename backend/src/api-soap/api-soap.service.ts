import { Injectable } from '@nestjs/common';
import { CreateApiSoapDto } from './dto/create-api-soap.dto';
import { UpdateApiSoapDto } from './dto/update-api-soap.dto';
import axios from 'axios';

import { parseStringPromise } from 'xml2js';
@Injectable()
export class ApiSoapService {
  create(createApiSoapDto: CreateApiSoapDto) {
    return 'This action adds a new apiSoap';
  }
  // la idea es que venga el codigo pais
  async findAll(codigoPais = 'AR'): Promise<{ total: number; provinces: object }> {
    try {
      // const codigoPais = 'AR' | 'CL';
      console.log(codigoPais);
      // &maxRows=24
      const url = `http://api.geonames.org/search?country=${codigoPais}&featureCode=ADM1&username=julianalcaraz`;

      // Hacemos una solicitud GET al microservicio que devuelve XML
      const response = await axios.get(url, {
        headers: { Accept: 'application/xml' },
        timeout: 60000, // Tiempo de espera en milisegundos (aquí, 10 segundos)
      });
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
