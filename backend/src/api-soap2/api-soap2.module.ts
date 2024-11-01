import { Module } from '@nestjs/common';
import { ApiSoap2Service } from './api-soap2.service';
import { ApiSoap2Controller } from './api-soap2.controller';

@Module({
  controllers: [ApiSoap2Controller],
  providers: [ApiSoap2Service],
})
export class ApiSoap2Module {}
