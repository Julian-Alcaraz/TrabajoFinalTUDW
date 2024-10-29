import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ApiGeorefService {
  constructor(private readonly httpService: HttpService) {}

  async obtenerLocalidades(provincia) {
    const url = `https://apis.datos.gob.ar/georef/api/localidades?provincia=${provincia}&campos=nombre&max=100&exacto=true&formato=json`;
    try {
      const response = await lastValueFrom(this.httpService.get(url));
      return response;
    } catch (error) {
      throw new Error(`Error al obtener localidades: ${error.message}`);
    }
  }
}
