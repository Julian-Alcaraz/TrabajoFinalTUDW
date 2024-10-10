import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ChicoService } from './chico.service';
import { CreateChicoDto } from './dto/create-chico.dto';
import { UpdateChicoDto } from './dto/update-chico.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('chico')
export class ChicoController {
  constructor(private readonly chicoService: ChicoService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Crea un nuevo chico' })
  @ApiResponse({ status: 201, description: 'Chico creado con exito' })
  // @ApiResponse({ status: 400, description: 'El dni del chico ya esta cargado en el sistema' })
  // @ApiResponse({ status: 400, description: 'El email del usuario ya esta cargado en el sistema' })
  async create(@Body() createChicoDto: CreateChicoDto) {
    const chico = await this.chicoService.create(createChicoDto);
    return { succes: true, data: chico, message: 'Chico creado con exito' };
  }

  @Get()
  @ApiOperation({ summary: 'Devuelve todos los chicos habilitados' })
  @ApiResponse({ status: 200, description: 'Retorna todas los chicos habilitados con exito' })
  findAll() {
    return this.chicoService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Devuelve el chico buscado' })
  @ApiResponse({ status: 200, description: 'Retorna el chico buscado con exito' })
  @ApiResponse({ status: 404, description: 'Chico no encontrado' })
  findOne(@Param('id') id: string) {
    return this.chicoService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualiza los datos de un chico' })
  @ApiResponse({ status: 200, description: 'Chico actualizado con exito' })
  @ApiResponse({ status: 404, description: 'Chico no encontrado' })
  @ApiResponse({ status: 400, description: 'No se enviaron cambios' })
  @ApiResponse({ status: 400, description: 'El dni del chico ya esta cargado en el sistema' })
  update(@Param('id') id: string, @Body() updateChicoDto: UpdateChicoDto) {
    const chicoModificado = this.chicoService.update(+id, updateChicoDto);
    return {
      success: true,
      data: chicoModificado,
      message: 'Chico modificado con exito',
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Borrado logico de un chico' })
  @ApiResponse({ status: 200, description: 'Chico borrado logicamente con exito' })
  @ApiResponse({ status: 404, description: 'Chico no encontrado' })
  remove(@Param('id') id: string) {
    return this.chicoService.remove(+id);
  }
}
