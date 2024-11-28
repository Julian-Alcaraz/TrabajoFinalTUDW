import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { BarrioService } from './barrio.service';
import { CreateBarrioDto } from './dto/create-barrio.dto';
import { UpdateBarrioDto } from './dto/update-barrio.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('barrio')
@UseGuards(JwtAuthGuard)
@ApiTags('barrio')
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
      message: 'Barrio creado con éxito',
    };
  }

  @Get()
  @ApiOperation({ summary: 'Devuelve todos los barrios habilitados y deshabilitados' })
  @ApiResponse({ status: 200, description: 'Retorna todos los barrios habilitados y deshabilitados con éxito' })
  async findAll() {
    const colBarrios = await this.barrioService.findAll();
    return {
      success: true,
      data: colBarrios,
      message: 'Barrios obtenidos con éxito',
    };
  }

  @Get('habilitados')
  @ApiOperation({ summary: 'Devuelve todos los barrios habilitados ' })
  @ApiResponse({ status: 200, description: 'Retorna todas las barrios habilitados con exito' })
  async findAllHabilitadas() {
    const colBarrios = await this.barrioService.findAllHabilitados();
    return {
      success: true,
      data: colBarrios,
      message: 'Barrios obtenidos con éxito',
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Devuelve todos un barrio' })
  @ApiResponse({ status: 200, description: 'Retorna el barrio habilitado con exito' })
  @ApiResponse({ status: 404, description: 'Barrio no encontrado' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const barrio = await this.barrioService.findOne(id);
    return {
      success: true,
      data: barrio,
      message: 'Barrio obtenido con éxito',
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualiza los datos de un barrio' })
  @ApiResponse({ status: 200, description: 'Barrio actualizado con exito' })
  @ApiResponse({ status: 404, description: 'Barrio no encontrado' })
  @ApiResponse({ status: 400, description: 'No se enviaron cambios' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateBarrioDto: UpdateBarrioDto) {
    const barrio = await this.barrioService.update(id, updateBarrioDto);
    return {
      success: true,
      data: barrio,
      message: 'Barrio actualizado correctamente',
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Borrado logico de un barrio' })
  @ApiResponse({ status: 200, description: 'Barrio borrado logicamente con exito' })
  @ApiResponse({ status: 404, description: 'Barrio no encontrado' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const barrio = await this.barrioService.remove(id);
    return {
      success: true,
      data: barrio,
      message: 'Barrio borrado logicamente',
    };
  }
}
