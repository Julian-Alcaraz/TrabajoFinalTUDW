import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BarrioService } from './barrio.service';
import { CreateBarrioDto } from './dto/create-barrio.dto';
import { UpdateBarrioDto } from './dto/update-barrio.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('barrio')
export class BarrioController {
  constructor(private readonly barrioService: BarrioService) {}

  @Post()
  @ApiOperation({ summary: 'Crea un nuevo barrio' })
  @ApiResponse({ status: 201, description: 'Barrio creado con exito' })
  async create(@Body() createBarrioDto: CreateBarrioDto) {
    const barrio = await this.barrioService.create(createBarrioDto);
    return {
      success: true,
      data: barrio,
      message: 'Barrio creado con exito',
    };
  }

  @Get()
  @ApiOperation({ summary: 'Devuelve todos los barrios ' })
  @ApiResponse({ status: 200, description: 'Retorna todos los barrios habilitados con exito' })
  async findAll() {
    const colBarrios = await this.barrioService.findAll();
    return {
      success: true,
      data: colBarrios,
      message: 'Usuario obtenido con exito',
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Devuelve todos los barrios ' })
  @ApiResponse({ status: 200, description: 'Retorna el barrio habilitado con exito' })
  @ApiResponse({ status: 404, description: 'Barrio no encontrado' })
  async findOne(@Param('id') id: string) {
    const barrio = await this.barrioService.findOne(+id);
    return {
      success: true,
      data: barrio,
      message: 'Barrio obtenido con exito',
    };
  }

  @Get('localidad/:id')
  @ApiOperation({ summary: 'Devuelve todos los barrios de una localidad ' })
  @ApiResponse({ status: 200, description: 'Retorna todos los barrios habilitados con exito' })
  @ApiResponse({ status: 404, description: 'Barrio no encontrado' })
  async findAllxLocalidad(@Param('id') id: string) {
    const colBarrios = await this.barrioService.findAllxLocalidad(+id);
    return {
      succes: true,
      data: colBarrios,
      message: 'Barrios encontrados',
    };
  }
  @Patch(':id')
  @ApiOperation({ summary: 'Actualiza los datos de un barrio' })
  @ApiResponse({ status: 200, description: 'Barrio actualizado con exito' })
  @ApiResponse({ status: 404, description: 'Barrio no encontrado' })
  @ApiResponse({ status: 400, description: 'No se enviaron cambios' })
  async update(@Param('id') id: string, @Body() updateBarrioDto: UpdateBarrioDto) {
    const barrio = await this.barrioService.update(+id, updateBarrioDto);
    return {
      succes: true,
      data: barrio,
      message: 'Barrios actualizado correctamente',
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Borrado logico de un barrio' })
  @ApiResponse({ status: 200, description: 'Barrio borrado logicamente con exito' })
  @ApiResponse({ status: 404, description: 'Barrio no encontrado' })
  async remove(@Param('id') id: string) {
    const barrio = await this.barrioService.remove(+id);
    return {
      succes: true,
      data: barrio,
      message: 'Barrio borrado logicamente',
    };
  }
}
