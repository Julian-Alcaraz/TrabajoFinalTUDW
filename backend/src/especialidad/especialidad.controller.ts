import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { EspecialidadService } from './especialidad.service';
import { CreateEspecialidadDto } from './dto/create-especialidad.dto';
import { UpdateEspecialidadDto } from './dto/update-especialidad.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('especialidad')
@UseGuards(JwtAuthGuard)
@ApiTags('especialidad')
export class EspecialidadController {
  constructor(private readonly especialidadService: EspecialidadService) {}

  @Post()
  @ApiOperation({ summary: 'Crea un nueva nueva especialidad' })
  @ApiResponse({ status: 201, description: 'Especialidad creada con exito' })
  async create(@Body() createEspecialidadDto: CreateEspecialidadDto) {
    const especialidad = await this.especialidadService.create(createEspecialidadDto);
    return {
      success: true,
      data: especialidad,
      message: 'Especialidad creado con exito',
    };
  }

  @Get()
  @ApiOperation({ summary: 'Devuelve todas las especialidades habilitadas' })
  @ApiResponse({ status: 200, description: 'Retorna todas las especialidades habilitadas con exito' })
  async findAll() {
    const especialidades = await this.especialidadService.findAll();
    return {
      success: true,
      data: especialidades,
      message: 'Especialidades obtenidas con exito',
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Devuelve la especialidad buscada' })
  @ApiResponse({ status: 200, description: 'Retorna la especialidad buscada con exito' })
  @ApiResponse({ status: 404, description: 'Especialidad no encontrada' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const especialidad = await this.especialidadService.findOne(id);
    return {
      success: true,
      data: especialidad,
      message: 'Especialidad obtenida con exito',
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualiza los datos de una especialidad' })
  @ApiResponse({ status: 200, description: 'Especialidad actualizada con exito' })
  @ApiResponse({ status: 400, description: 'No se enviaron cambios' })
  @ApiResponse({ status: 404, description: 'Especialidad no encontrada' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateEspecialidadDto: UpdateEspecialidadDto) {
    const especialidadModificada = await this.especialidadService.update(id, updateEspecialidadDto);
    return {
      success: true,
      data: especialidadModificada,
      message: 'Especialidad modificada con exito',
    };
  }

  @Delete('eliminar/:id')
  @ApiOperation({ summary: 'Borrado logico de una especialidad' })
  @ApiResponse({ status: 200, description: 'Especialidad borrada logicamente con exito' })
  @ApiResponse({ status: 400, description: 'La especialidad ya esta deshabilitada' })
  @ApiResponse({ status: 404, description: 'Especialidad no encontrada' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const especialidadBorrada = await this.especialidadService.remove(id);
    return {
      success: true,
      data: especialidadBorrada,
      message: 'Especialidad borrada logicamente con exito',
    };
  }
}
