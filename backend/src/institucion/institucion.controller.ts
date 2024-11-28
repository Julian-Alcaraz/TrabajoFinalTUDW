import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

import { InstitucionService } from './institucion.service';
import { CreateInstitucionDto } from './dto/create-institucion.dto';
import { UpdateInstitucionDto } from './dto/update-institucion.dto';

@Controller('institucion')
@UseGuards(JwtAuthGuard)
@ApiTags('institucion')
export class InstitucionController {
  constructor(private readonly institucionService: InstitucionService) {}

  @Post()
  @ApiOperation({ summary: 'Crea una nueva institucion' })
  @ApiResponse({ status: 201, description: 'Institucion creada con exito' })
  async create(@Body() createInstitucionDto: CreateInstitucionDto) {
    const institucion = this.institucionService.create(createInstitucionDto);
    return {
      success: true,
      data: institucion,
      message: 'Instituciones creada con exito',
    };
  }

  @Get()
  @ApiOperation({ summary: 'Devuelve todas las instituciones habilitados' })
  @ApiResponse({ status: 200, description: 'Retorna todas las instituciones habilitados con exito' })
  async findAll() {
    const instituciones = await this.institucionService.findAll();
    return {
      success: true,
      data: instituciones,
      message: 'Instituciones encontradas con exito',
    };
  }

  @Get('habilitadas')
  @ApiOperation({ summary: 'Devuelve todas las instituciones habilitadas ' })
  @ApiResponse({ status: 200, description: 'Retorna todas las instituciones habilitadas con exito' })
  async findAllHabilitadas() {
    const instituciones = await this.institucionService.findAllHabilitadas();
    return {
      success: true,
      data: instituciones,
      message: 'Instituciones obtenidas con exito',
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Devuelve la institucion buscada' })
  @ApiResponse({ status: 200, description: 'Retorna la institucion buscada con exito' })
  @ApiResponse({ status: 404, description: 'Institucion no encontrada' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const institucion = await this.institucionService.findOne(id);
    return {
      success: true,
      data: institucion,
      message: 'Institucion encontrada con exito',
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualiza los datos de una institucion' })
  @ApiResponse({ status: 200, description: 'Institucion actualizada con exito' })
  @ApiResponse({ status: 404, description: 'Institucion no encontrada' })
  @ApiResponse({ status: 400, description: 'No se enviaron cambios' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateInstitucionDto: UpdateInstitucionDto) {
    const institucionModifcada = await this.institucionService.update(id, updateInstitucionDto);
    return {
      success: true,
      data: institucionModifcada,
      message: 'Institucion modificada con exito',
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Borrado logico de una isntitucion' })
  @ApiResponse({ status: 200, description: 'Institucion borrada logicamente con exito' })
  @ApiResponse({ status: 404, description: 'Institucion no encontrada' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const institucionEliminada = await this.institucionService.remove(id);
    return {
      success: true,
      data: institucionEliminada,
      message: 'Institucion eliminada con exito',
    };
  }
}
