import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateMarcoDto } from './dto/create-marco.dto';
import { UpdateMarcoDto } from './dto/update-marco.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { MarcoService } from './marco.service';

@Controller('marco')
@UseGuards(JwtAuthGuard)
@ApiTags('marco')
export class MarcoController {
  constructor(private readonly marcoService: MarcoService) {}

  @Post()
  @ApiOperation({ summary: 'Crea un nuevo marco' })
  @ApiResponse({ status: 201, description: 'Marco creado con exito' })
  @ApiResponse({ status: 400, description: 'La especialidad no existe' })
  async create(@Body() createMarcoDto: CreateMarcoDto) {
    const marco = await this.marcoService.create(createMarcoDto);
    return {
      success: true,
      data: marco,
      message: 'Marco creado con exito',
    };
  }

  @Get()
  @ApiOperation({ summary: 'Devuelve todos los marcos habilitados' })
  @ApiResponse({ status: 200, description: 'Retorna todas los marcos habilitados con exito' })
  async findAll() {
    const marcos = await this.marcoService.findAll();
    return {
      success: true,
      data: marcos,
      message: 'Marcos obtenidos con exito',
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Devuelve el marco buscado' })
  @ApiResponse({ status: 200, description: 'Retorna el marco buscado con exito' })
  @ApiResponse({ status: 404, description: 'Marco no encontrado' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const marco = await this.marcoService.findOne(id);
    return {
      success: true,
      data: marco,
      message: 'Marco obtenido con exito',
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualiza los datos de un marco' })
  @ApiResponse({ status: 200, description: 'Marco actualizado con exito' })
  @ApiResponse({ status: 400, description: 'No se enviaron cambios' })
  @ApiResponse({ status: 404, description: 'Marco no encontrado' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateMarcoDto: UpdateMarcoDto) {
    const marcoModificado = await this.marcoService.update(id, updateMarcoDto);
    return {
      success: true,
      data: marcoModificado,
      message: 'Marco modificado con exito',
    };
  }

  @Delete('eliminar/:id')
  @ApiOperation({ summary: 'Borrado logico de un marco' })
  @ApiResponse({ status: 200, description: 'Marco borrado logicamente con exito' })
  @ApiResponse({ status: 400, description: 'El marco ya esta deshabilitado' })
  @ApiResponse({ status: 404, description: 'Marco no encontrado' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const marcoBorrado = await this.marcoService.remove(id);
    return {
      success: true,
      data: marcoBorrado,
      message: 'Marco borrado logicamente con exito',
    };
  }
}
