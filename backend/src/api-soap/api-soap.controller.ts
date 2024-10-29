import { Controller, Post, Body } from '@nestjs/common';
import { ApiSoapService } from './api-soap.service';

@Controller('api-soap')
export class ApiSoapController {
  constructor(private readonly apiSoapService: ApiSoapService) {}

  @Post('provinces')
  async findAll(@Body() body: { pais: string }) {
    const response = await this.apiSoapService.findAll(body.pais);
    if (response.total > 0) {
      return {
        success: true,
        data: response,
        message: 'Provincias encontradas',
      };
    } else {
      return {
        success: false,
        data: response,
        message: 'Provincias no encontradas',
      };
    }
  }
}
