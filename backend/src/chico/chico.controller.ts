import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

import { ChicoService } from './chico.service';
import { CreateChicoDto } from './dto/create-chico.dto';
import { UpdateChicoDto } from './dto/update-chico.dto';

@Controller('chico')
@UseGuards(JwtAuthGuard)
@ApiTags('chico')
export class ChicoController {
  constructor(private readonly chicoService: ChicoService) {}

  @Post()
  @ApiOperation({ summary: 'Crea un nuevo chico' })
  @ApiResponse({ status: 201, description: 'Chico creado con exito' })
  // @ApiResponse({ status: 400, description: 'El dni del chico ya esta cargado en el sistema' })
  // @ApiResponse({ status: 400, description: 'El email del usuario ya esta cargado en el sistema' })
  async create(@Body() createChicoDto: CreateChicoDto) {
    const chico = await this.chicoService.create(createChicoDto);
    return {
      success: true,
      data: chico,
      message: 'Chico creado con exito',
    };
  }

  @Get()
  @ApiOperation({ summary: 'Devuelve todos los chicos' })
  @ApiResponse({ status: 200, description: 'Retorna todos los chicos con exito' })
  async findAll() {
    const chicos = await this.chicoService.findAll();
    return {
      success: true,
      data: chicos,
      message: 'Chicos encontrados con exito',
    };
  }
  @Get('/activity/:year')
  @ApiOperation({ summary: 'Devuelve todos los chicos con actividad' })
  @ApiResponse({ status: 200, description: 'Retorna todos los chicos con exito' })
  async findAllByActivity(@Param('year', ParseIntPipe) year: number) {
    const chicos = await this.chicoService.findAllWithActivity(year);
    return {
      success: true,
      data: chicos,
      message: 'Chicos encontrados con exito',
    };
  }
  @Get(':id')
  @ApiOperation({ summary: 'Devuelve el chico buscado' })
  @ApiResponse({ status: 200, description: 'Retorna el chico buscado con exito' })
  @ApiResponse({ status: 404, description: 'Chico no encontrado' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const chico = await this.chicoService.findOne(id);
    return {
      success: true,
      data: chico,
      message: 'Chico encontrado con exito',
    };
  }

  @Get('dni/:dni')
  @ApiOperation({ summary: 'Devuelve el chico buscado por dni' })
  @ApiResponse({ status: 200, description: 'Retorna el chico buscado con exito' })
  @ApiResponse({ status: 404, description: 'Chico no encontrado' })
  async findOneByDni(@Param('dni', ParseIntPipe) dni: number) {
    const chico = await this.chicoService.findOneByDni(dni);
    if (chico) {
      return {
        success: true,
        data: chico,
        message: 'Chico encontrado con exito',
      };
    } else {
      return {
        success: false,
        data: chico,
        message: 'Chico no encontrado.',
      };
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualiza los datos de un chico' })
  @ApiResponse({ status: 200, description: 'Chico actualizado con exito' })
  @ApiResponse({ status: 404, description: 'Chico no encontrado' })
  @ApiResponse({ status: 400, description: 'No se enviaron cambios' })
  @ApiResponse({ status: 400, description: 'El dni del chico ya esta cargado en el sistema' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateChicoDto: UpdateChicoDto) {
    const chicoModificado = await this.chicoService.update(id, updateChicoDto);
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
  async remove(@Param('id', ParseIntPipe) id: number) {
    const chicoEliminado = await this.chicoService.remove(id);
    return {
      success: true,
      data: chicoEliminado,
      message: 'Chico eliminado con exito',
    };
  }

  @Get(':id/consultas')
  @ApiOperation({ summary: 'Devuelve las consultas a las que asistio el niño' })
  @ApiResponse({ status: 200, description: 'Retorna las consultas del chhico' })
  @ApiResponse({ status: 404, description: 'Chico no encontrado' })
  async findChicosConsultas(@Param('id', ParseIntPipe) id: number) {
    const consultas = await this.chicoService.findChicosConsultas(id);
    return {
      success: true,
      data: consultas,
      message: 'Consultas encontradas por chico con exito',
    };
  }

  @Get('cargadosxanios/:year')
  @ApiOperation({ summary: 'Devuelve la cantidad de chicos cargados por año en los ultimos 4' })
  @ApiResponse({ status: 200, description: 'Devuelve la cantidad de chicos cargados por año en los ultimos 4' })
  @ApiResponse({ status: 404, description: 'Consulta no encontrada' })
  async countChicosUpxYear(@Param('year', ParseIntPipe) year: number) {
    const arrayCount = await this.chicoService.countChicosUpxYear(year);
    return {
      success: true,
      data: arrayCount,
      message: 'Chicos contados con exito',
    };
  }
}
