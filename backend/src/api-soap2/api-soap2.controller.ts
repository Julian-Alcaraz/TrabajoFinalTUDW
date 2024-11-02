import { Controller, Get, Query } from '@nestjs/common';
import { ApiSoap2Service } from './api-soap2.service';
//Url del endpoint // http://localhost:3000/api-soap2/add?intA=5&intB=10
@Controller('api-soap2')
export class ApiSoap2Controller {
  constructor(private readonly apiSoap2Service: ApiSoap2Service) {}

  @Get('add')
  async add(@Query('intA') intA: number, @Query('intB') intB: number) {
    return this.apiSoap2Service.add(intA, intB);
  }
}
