import { Controller, Get, Param } from '@nestjs/common';
import { ApiGeorefService } from './api-georef.service';
@Controller('api-georef')
export class ApiGeorefController {
  constructor(private readonly apiGeorefService: ApiGeorefService) {}

  @Get(':provincia')
  async obtenerLocalidades(@Param('provincia') provincia: string) {
    const localidades = await this.apiGeorefService.obtenerLocalidades(provincia);
    return {
      success: true,
      data: localidades.data,
      message: 'Localidades obtenidas con exito',
    };
  }
}
