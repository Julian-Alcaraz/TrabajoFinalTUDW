import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { BarrioService } from './barrio.service';
import { CreateBarrioDto } from './dto/create-barrio.dto';
import { UpdateBarrioDto } from './dto/update-barrio.dto';

@Controller('barrio')
@ApiTags('barrio')
export class BarrioController {
  constructor(private readonly barrioService: BarrioService) {}

  @Post()
  @ApiOperation({ summary: 'Crea un nuevo barrio' })
  @ApiResponse({ status: 201, description: 'Barrio creado con exito' })
  async create(@Body() createBarrioDto: CreateBarrioDto) {
    console.log(createBarrioDto);
    const barrio = await this.barrioService.create(createBarrioDto);
    console.log(barrio);

    return {
      success: true,
      data: barrio,
      message: 'Barrio creado con exito',
    };
  }

  @Get()
  @ApiOperation({ summary: 'Devuelve todos los barrios' })
  @ApiResponse({ status: 200, description: 'Retorna todos los barrios habilitados con exito' })
  async findAll() {
    const colBarrios = await this.barrioService.findAll();
    return {
      success: true,
      data: colBarrios,
      message: 'Barrios obtenidos con exito',
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Devuelve todos los barrios' })
  @ApiResponse({ status: 200, description: 'Retorna el barrio habilitado con exito' })
  @ApiResponse({ status: 404, description: 'Barrio no encontrado' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const barrio = await this.barrioService.findOne(id);
    return {
      success: true,
      data: barrio,
      message: 'Barrio obtenido con exito',
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
      succes: true,
      data: barrio,
      message: 'Barrios actualizado correctamente',
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Borrado logico de un barrio' })
  @ApiResponse({ status: 200, description: 'Barrio borrado logicamente con exito' })
  @ApiResponse({ status: 404, description: 'Barrio no encontrado' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const barrio = await this.barrioService.remove(id);
    return {
      succes: true,
      data: barrio,
      message: 'Barrio borrado logicamente',
    };
  }
}
