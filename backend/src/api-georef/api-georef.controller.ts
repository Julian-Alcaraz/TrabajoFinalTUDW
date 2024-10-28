import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiGeorefService } from './api-georef.service';
import { CreateApiGeorefDto } from './dto/create-api-georef.dto';
import { UpdateApiGeorefDto } from './dto/update-api-georef.dto';

@Controller('api-georef')
export class ApiGeorefController {
  constructor(private readonly apiGeorefService: ApiGeorefService) {}

  @Get()
  obtenerLocalidades() {
    return this.apiGeorefService.obtenerLocalidades();
  }

  /*
  @Post()
  create(@Body() createApiGeorefDto: CreateApiGeorefDto) {
    return this.apiGeorefService.create(createApiGeorefDto);
  }

  @Get()
  findAll() {
    return this.apiGeorefService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.apiGeorefService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateApiGeorefDto: UpdateApiGeorefDto) {
    return this.apiGeorefService.update(+id, updateApiGeorefDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.apiGeorefService.remove(+id);
  }
  */
}
