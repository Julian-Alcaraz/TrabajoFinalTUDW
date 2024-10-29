import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiSoapService } from './api-soap.service';
import { CreateApiSoapDto } from './dto/create-api-soap.dto';
import { UpdateApiSoapDto } from './dto/update-api-soap.dto';

@Controller('api-soap')
export class ApiSoapController {
  constructor(private readonly apiSoapService: ApiSoapService) {}

  @Post()
  create(@Body() createApiSoapDto: CreateApiSoapDto) {
    return this.apiSoapService.create(createApiSoapDto);
  }

  @Post('provinces')
  findAll(@Body() body: { pais: string }) {
    return this.apiSoapService.findAll(body.pais);
  }

}
