import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { LocalidadService } from './localidad.service';
import { CreateLocalidadDto } from './dto/create-localidad.dto';
import { UpdateLocalidadDto } from './dto/update-localidad.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('localidad')
@UseGuards(JwtAuthGuard)
@ApiTags('localidad')
export class LocalidadController {
  constructor(private readonly localidadService: LocalidadService) {}

  @Post()
  @ApiOperation({ summary: 'Crea una nueva localidad' })
  @ApiResponse({ status: 201, description: 'Localidad creada con exito' })
  async create(@Body() createLocalidadDto: CreateLocalidadDto) {
    const localidad = await this.localidadService.create(createLocalidadDto);
    return {
      success: true,
      data: localidad,
      message: 'Localidad creada con exito',
    };
  }

  @Get()
  @ApiOperation({ summary: 'Devuelve todas las localidades habilitadas y deshabilitadas ' })
  @ApiResponse({ status: 200, description: 'Retorna todas las localidades habilitadas y deshabilitadas' })
  async findAll() {
    const colLocalidad = await this.localidadService.findAll();
    return {
      success: true,
      data: colLocalidad,
      message: 'Localidades obtenidas con exito',
    };
  }

  @Get('habilitadas')
  @ApiOperation({ summary: 'Devuelve todas las localidades habilitadas ' })
  @ApiResponse({ status: 200, description: 'Retorna todas las localidades habilitadas con exito' })
  async findAllHabilitadas() {
    const colLocalidad = await this.localidadService.findAllHabilitadas();
    return {
      success: true,
      data: colLocalidad,
      message: 'Localidades obtenidas con exito',
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Devuelve una localidad' })
  @ApiResponse({ status: 200, description: 'Retorna una localidad habilitada con exito' })
  @ApiResponse({ status: 404, description: 'Localidad no encontrada' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const localidad = await this.localidadService.findOne(id);
    return {
      success: true,
      data: localidad,
      message: 'Localidad obtenida con exito',
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualiza los datos de una localidad' })
  @ApiResponse({ status: 200, description: 'Localidad actualizada con exito' })
  @ApiResponse({ status: 404, description: 'Localidad no encontrada' })
  @ApiResponse({ status: 400, description: 'No se enviaron cambios' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateLocalidadDto: UpdateLocalidadDto) {
    const localidad = await this.localidadService.update(id, updateLocalidadDto);
    return {
      success: true,
      data: localidad,
      message: 'Localidad modificada con exito',
    };
  }

  @Get(':id/barrios')
  @ApiOperation({ summary: 'Devuelve todos los barrios de una localidad' })
  @ApiResponse({ status: 200, description: 'Retorna todos los barrios de una localidad habilitados con exito' })
  @ApiResponse({ status: 404, description: 'Localidad no encontrada' })
  @ApiResponse({ status: 404, description: 'Esa localidad no tiene barrios' })
  async findAllXLocalidad(@Param('id', ParseIntPipe) id: number) {
    const colBarrios = await this.localidadService.findAllXLocalidad(id);
    return {
      succes: true,
      data: colBarrios,
      message: 'Barrios de una localidad encontrados',
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Borrado logico de una localidad' })
  @ApiResponse({ status: 200, description: 'Localidad borrada logicamente con exito' })
  @ApiResponse({ status: 404, description: 'Localidad no encontrada' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const localidad = await this.localidadService.remove(id);
    return {
      success: true,
      data: localidad,
      message: 'Localidad borrada logicamente con exito',
    };
  }
}
