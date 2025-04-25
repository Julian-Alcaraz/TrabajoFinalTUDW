import { plainToInstance } from 'class-transformer';
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ResponseTallerDto } from './dto/response-taller.dto';
import { TallerService } from './taller.service';
import { CreateTallerDto } from './dto/create-taller.dto';
import { UpdateTallerDto } from './dto/update-taller.dto';
import { GraficosService } from './graficos.service';

@Controller('taller')
@UseGuards(JwtAuthGuard)
@ApiTags('taller')
export class TallerController {
  constructor(
    private readonly tallerService: TallerService,
    private readonly graficosService: GraficosService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crea un nuevo taller' })
  @ApiResponse({ status: 201, description: 'Taller creado con exito' })
  @ApiResponse({ status: 404, description: 'Especialidad no encontrada' })
  @ApiResponse({ status: 404, description: 'Institucion no encontrada' })
  @ApiResponse({ status: 404, description: 'Curso no encontrado' })
  @ApiResponse({ status: 404, description: 'Marco no encontrado' })
  @ApiResponse({ status: 400, description: 'La especialidad de el taller debe coincidir con la del marco' })
  async create(@Body() createTallerDto: CreateTallerDto) {
    const taller = await this.tallerService.create(createTallerDto);
    return {
      success: true,
      data: taller,
      message: 'Taller creado con exito',
    };
  }

  @Get()
  @ApiOperation({ summary: 'Devuelve todos los talleres habilitados o deshabilitados' })
  @ApiResponse({ status: 200, description: 'Retorna todas los talleres habilitados o deshabilitados con exito' })
  async findAll() {
    const talleres = plainToInstance(ResponseTallerDto, await this.tallerService.findAll());
    return {
      success: true,
      data: talleres,
      message: 'Talleres obtenidos con exito',
    };
  }

  @Get('habilitados')
  @ApiOperation({ summary: 'Devuelve todos los talleres habilitados ' })
  @ApiResponse({ status: 200, description: 'Retorna todas las barrios habilitados con exito' })
  async findAllHabilitados() {
    const talleres = plainToInstance(ResponseTallerDto, await this.tallerService.findAllHabilitados());
    return {
      success: true,
      data: talleres,
      message: 'Talleres obtenidos con éxito',
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Devuelve el taller buscado' })
  @ApiResponse({ status: 200, description: 'Retorna el taller buscado con exito' })
  @ApiResponse({ status: 404, description: 'Taller no encontrado' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const taller = plainToInstance(ResponseTallerDto, await this.tallerService.findOne(id));
    return {
      success: true,
      data: taller,
      message: 'Taller obtenido con exito',
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualiza los datos de un taller' })
  @ApiResponse({ status: 200, description: 'Taller actualizado con exito' })
  @ApiResponse({ status: 400, description: 'No se enviaron cambios' })
  @ApiResponse({ status: 404, description: 'Taller no encontrado' })
  @ApiResponse({ status: 404, description: 'Especialidad no encontrada' })
  @ApiResponse({ status: 404, description: 'Institucion no encontrada' })
  @ApiResponse({ status: 404, description: 'Curso no encontrado' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateTallerDto: UpdateTallerDto) {
    const tallerModificado = await this.tallerService.update(id, updateTallerDto);
    return {
      success: true,
      data: tallerModificado,
      message: 'Taller modificado con exito',
    };
  }

  @Delete('eliminar/:id')
  @ApiOperation({ summary: 'Borrado logico de un taller' })
  @ApiResponse({ status: 200, description: 'Taller borrado logicamente con exito' })
  @ApiResponse({ status: 400, description: 'El taller ya esta deshabilitado' })
  @ApiResponse({ status: 404, description: 'Taller no encontrado' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const tallerBorrado = await this.tallerService.remove(id);
    return {
      success: true,
      data: tallerBorrado,
      message: 'Taller borrado logicamente con exito',
    };
  }

  // ============================ Graficos ============================

  @Get('countTypeByYear/:year/curso/:id_curso/:porcentaje')
  async talleresxEspecialidad(@Param('year', ParseIntPipe) year: number, @Param('id_curso', ParseIntPipe) id_curso: number, @Param('porcentaje', ParseIntPipe) porcentaje: number) {
    const talleres = await this.graficosService.countTypeByYear(year, id_curso, porcentaje);
    return {
      success: true,
      data: talleres,
      message: 'Talleres obtenidos con exito',
    };
  }

  @Get('contarxAnios/:year')
  async contarxAnios(@Param('year', ParseIntPipe) year: number) {
    const talleres = await this.graficosService.countByYear(year);
    return {
      success: true,
      data: talleres,
      message: 'Talleres obtenidos con exito',
    };
  }

  @Get('countParticipantesxYear/:year/curso/:id_curso/:porcentaje')
  async contarParticipantesxAnio(@Param('year', ParseIntPipe) year: number, @Param('id_curso', ParseIntPipe) id_curso: number, @Param('porcentaje', ParseIntPipe) porcentaje: number) {
    const talleres = await this.graficosService.countParticipantesxYear(year, id_curso, porcentaje);
    return {
      success: true,
      data: talleres,
      message: 'Talleres obtenidos con exito',
    };
  }

  @Get('countCantEncuentrosxMarco/:year/curso/:id_curso/:porcentaje')
  async countCantEncuentrosxMarco(@Param('year', ParseIntPipe) year: number, @Param('id_curso', ParseIntPipe) id_curso: number, @Param('porcentaje', ParseIntPipe) porcentaje: number) {
    const talleres = await this.graficosService.countCantEncuentrosxMarco(year, id_curso, porcentaje);
    return {
      success: true,
      data: talleres,
      message: 'Talleres obtenidos con exito',
    };
  }
}
