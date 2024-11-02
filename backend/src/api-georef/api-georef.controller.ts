import { Controller, Get, Param } from '@nestjs/common';
import { ApiGeorefService } from './api-georef.service';
@Controller('api-georef')
export class ApiGeorefController {
  constructor(private readonly apiGeorefService: ApiGeorefService) {}

  @Get(':provincia')
  async obtenerLocalidades(@Param('provincia') provincia: string) {
    const data = await this.apiGeorefService.obtenerLocalidades(provincia);
    if (data.localidades.length > 0) {
      return {
        success: true,
        data: data,
        message: 'Localidades obtenidas con exito',
      };
    } else {
      return {
        success: false,
        data: data,
        message: 'No se obtuvieron localidades',
      };
    }
  }
}
