import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ApiGeorefService {
  constructor(private readonly httpService: HttpService) {}

  async obtenerLocalidades() {
    const url = 'https://apis.datos.gob.ar/georef/api/localidades?provincia=Neuqu%C3%A9n&campos=nombre&max=100&exacto=true&formato=json';
    try {
      const response = await lastValueFrom(this.httpService.get(url));
      return response.data;
    } catch (error) {
      throw new Error(`Error al obtener localidades: ${error.message}`);
    }
  }

  /*
  create(createApiGeorefDto: CreateApiGeorefDto) {
    return 'This action adds a new apiGeoref';
  }

  findAll() {
    return `This action returns all apiGeoref`;
  }

  findOne(id: number) {
    return `This action returns a #${id} apiGeoref`;
  }

  update(id: number, updateApiGeorefDto: UpdateApiGeorefDto) {
    return `This action updates a #${id} apiGeoref`;
  }

  remove(id: number) {
    return `This action removes a #${id} apiGeoref`;
  }
  */
}
