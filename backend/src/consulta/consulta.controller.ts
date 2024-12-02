import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

import { ConsultaService } from './consulta.service';
import { CreateConsultaDto } from './dto/create-consulta.dto';
import { UpdateConsultaDto } from './dto/update-consulta.dto';
import { GraficosService } from './graficos.service';

@Controller('consulta')
@UseGuards(JwtAuthGuard)
export class ConsultaController {
  constructor(
    private readonly consultaService: ConsultaService,
    private readonly graficosService: GraficosService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crea una nueva consulta' })
  @ApiResponse({ status: 201, description: 'Consulta creada con exito' })
  async create(@Body() createConsultaDto: CreateConsultaDto, @Req() req: any) {
    const consulta = await this.consultaService.create(createConsultaDto, req.user);
    return {
      success: true,
      data: consulta,
      message: `Consulta ${createConsultaDto.type} cargada con exito.`,
    };
  }

  @Post('busquedaPersonalizada')
  @ApiOperation({ summary: 'Devuelte todas las consultas de una busqueda personalizada' })
  @ApiResponse({ status: 201, description: 'Consultas obtenidas con exito' })
  async busquedaPersonalizada(@Body() data: any) {
    const consultas = await this.consultaService.busquedaPersonalizada(data);
    return {
      success: true,
      data: consultas,
      message: 'Consultas obtenidas con exito.',
    };
  }

  @Get()
  @ApiOperation({ summary: 'Devuelte todas las consultas relacionadas con chico, curso e institución pero sin los datos por especialidad' })
  @ApiResponse({ status: 201, description: 'Consultas obtenidas con exito' })
  async findAll() {
    const consultas = await this.consultaService.findAll();
    return {
      success: true,
      data: consultas,
      message: 'Consultas obtenidas con exito.',
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Devuelte una consulta con todos sus datos' })
  @ApiResponse({ status: 201, description: 'Consulta obtenida con exito' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const consulta = await this.consultaService.findOne(id);
    return {
      success: true,
      data: consulta,
      message: 'Consulta obtenida con exito.',
    };
  }

  @Get('year/:year')
  @ApiOperation({ summary: 'Devuelte todas las consultas de un año especifico relacionadas con chico, curso e institución pero sin los datos por especialidad' })
  @ApiResponse({ status: 201, description: 'Consultas obtenidas con exito' })
  async findAllByYear(@Param('year', ParseIntPipe) year: number) {
    const consultas = await this.consultaService.findAllByYear(year);
    return {
      success: true,
      data: consultas,
      message: 'Consultas obtenidas con exito.',
    };
  }

  @Get('primeraVezChico/:id/:tipoConsulta')
  @ApiOperation({ summary: 'Devuelte si es la primera vez del chico en una consulta o no' })
  @ApiResponse({ status: 201, description: 'Consulta obtenida con exito' })
  async esPrimeraVez(@Param('id', ParseIntPipe) id: number, @Param('tipoConsulta') tipoConsulta: string) {
    const respuesta = await this.consultaService.esPrimeraVez(id, tipoConsulta);
    return {
      success: true,
      data: respuesta,
      message: 'Primera vez obtenida con exito.',
    };
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateConsultaDto: UpdateConsultaDto) {
    const respuesta = await this.consultaService.update(id, updateConsultaDto);
    return {
      success: true,
      data: respuesta,
      message: 'Consulta acutualizada con exito.',
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Borrado logico de una consulta' })
  @ApiResponse({ status: 200, description: 'Consulta borrada logicamente con exito' })
  @ApiResponse({ status: 404, description: 'Consulta no encontrada' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const consultaEliminada = await this.consultaService.remove(id);
    return {
      success: true,
      data: consultaEliminada,
      message: 'Consulta eliminada con exito',
    };
  }
  // Graficos routes
  @Get('contarXanios/:year')
  @ApiOperation({ summary: 'Cuenta todas las consultas por año de los ultimos 4' })
  @ApiResponse({ status: 201, description: 'Datos obtenidos con exito.' })
  async countByYear(@Param('year', ParseIntPipe) year: number) {
    const cantByYearList = await this.graficosService.countByYear(year);
    return {
      success: true,
      data: cantByYearList,
      message: 'Datos obtenidos con exito.',
    };
  }

  @Get('contarTipoXanios/:year')
  @ApiOperation({ summary: 'Cuenta todas las consultas por año de los ultimos 4' })
  @ApiResponse({ status: 201, description: 'Datos obtenidos con exito' })
  async countTypeByYear(@Param('year', ParseIntPipe) year: number) {
    const cantByYearList = await this.graficosService.countTypeByYear(year);
    return {
      success: true,
      data: cantByYearList,
      message: 'Datos obtenidos con exito.',
    };
  }

  @Get('contarTipoXanios/:year/institucion/:id_institucion')
  @ApiOperation({ summary: 'Cuenta todas los tipos de  consultas por año e institucion' })
  @ApiResponse({ status: 201, description: 'Datos obtenidos con exito' })
  async countTypeByYearAndInstitucion(@Param('year', ParseIntPipe) year: number, @Param('id_institucion', ParseIntPipe) id_institucion: number) {
    const cantByYearList = await this.graficosService.countTypeByYearAndInstitucion(year, id_institucion);
    return {
      success: true,
      data: cantByYearList,
      message: 'Datos obtenidos con exito.',
    };
  }

  @Get('estadoNutricionalPorAnio/:year/curso/:id')
  @ApiOperation({ summary: '' })
  @ApiResponse({ status: 201, description: 'Datos obtenidos con exito' })
  async estadoNutricional(@Param('year', ParseIntPipe) year: number, @Param('id', ParseIntPipe) id: number) {
    const cantByYearList = await this.graficosService.estadoNutricionalData(year, id);
    return {
      success: true,
      data: cantByYearList,
      message: 'Datos obtenidos con exito.',
    };
  }

  @Get('tensionArterialPorAnio/:year/curso/:id')
  @ApiOperation({ summary: '' })
  @ApiResponse({ status: 201, description: 'Datos obtenidos con exito' })
  async tensionArterial(@Param('year', ParseIntPipe) year: number, @Param('id', ParseIntPipe) id: number) {
    const cantByYearList = await this.graficosService.tensionArterialData(year, id);
    return {
      success: true,
      data: cantByYearList,
      message: 'Datos obtenidos con exito.',
    };
  }

  @Post('tensionxEstadoPorAnio/:year/curso/:id')
  @ApiOperation({ summary: '' })
  @ApiResponse({ status: 201, description: 'Datos obtenidos con exito' })
  async tensionxEstado(@Body() data: any, @Param('year', ParseIntPipe) year: number, @Param('id', ParseIntPipe) id: number) {
    const estado = data.estado;
    const cantByYearList = await this.graficosService.tensionxEstadoData(year, id, estado);
    return {
      success: true,
      data: cantByYearList,
      message: 'Datos obtenidos con exito.',
    };
  }

  @Get('porcentajeEstadoNutricionalPorAnio/:year/curso/:id/:porcentaje')
  @ApiOperation({ summary: '' })
  @ApiResponse({ status: 201, description: 'Datos obtenidos con exito' })
  async porcentajeEstadoNutricional(@Param('year', ParseIntPipe) year: number, @Param('id', ParseIntPipe) id: number, @Param('porcentaje', ParseIntPipe) porcentaje: number) {
    const cantByYearList = await this.graficosService.porcentajeEstadoNutricional(year, id, porcentaje);
    return {
      success: true,
      data: cantByYearList,
      message: 'Datos obtenidos con exito.',
    };
  }

  @Get('porcentajeTensionArterialPorAnio/:year/curso/:id/:porcentaje')
  @ApiOperation({ summary: '' })
  @ApiResponse({ status: 201, description: 'Datos obtenidos con exito' })
  async porcentajeTensionArterial(@Param('year', ParseIntPipe) year: number, @Param('id', ParseIntPipe) id: number, @Param('porcentaje', ParseIntPipe) porcentaje: number) {
    const cantByYearList = await this.graficosService.porcentajeTensionArterialData(year, id, porcentaje);
    return {
      success: true,
      data: cantByYearList,
      message: 'Datos obtenidos con exito.',
    };
  }

  @Get('porcentajeExamenVisualPorAnio/:year/curso/:id/:porcentaje')
  @ApiOperation({ summary: '' })
  @ApiResponse({ status: 201, description: 'Datos obtenidos con exito' })
  async porcentajeExamenVisual(@Param('year', ParseIntPipe) year: number, @Param('id', ParseIntPipe) id: number, @Param('porcentaje', ParseIntPipe) porcentaje: number) {
    const cantByYearList = await this.graficosService.porcentajeExamenVisualData(year, id, porcentaje);
    return {
      success: true,
      data: cantByYearList,
      message: 'Datos obtenidos con exito.',
    };
  }
  @Get('porcentajeVacunacionPorAnio/:year/curso/:id/:porcentaje')
  @ApiOperation({ summary: '' })
  @ApiResponse({ status: 201, description: 'Datos obtenidos con exito' })
  async porcentajeVacunacion(@Param('year', ParseIntPipe) year: number, @Param('id', ParseIntPipe) id: number, @Param('porcentaje', ParseIntPipe) porcentaje: number) {
    const cantByYearList = await this.graficosService.porcentajeVacunacionData(year, id, porcentaje);
    return {
      success: true,
      data: cantByYearList,
      message: 'Datos obtenidos con exito.',
    };
  }
  @Get('porcentajeOrtopediaPorAnio/:year/curso/:id/:porcentaje')
  @ApiOperation({ summary: '' })
  @ApiResponse({ status: 201, description: 'Datos obtenidos con exito' })
  async porcentajeOrtopedia(@Param('year', ParseIntPipe) year: number, @Param('id', ParseIntPipe) id: number, @Param('porcentaje', ParseIntPipe) porcentaje: number) {
    const cantByYearList = await this.graficosService.porcentajeOrtopediaData(year, id, porcentaje);
    return {
      success: true,
      data: cantByYearList,
      message: 'Datos obtenidos con exito.',
    };
  }
  @Get('porcentajeLenguajePorAnio/:year/curso/:id/:porcentaje')
  @ApiOperation({ summary: '' })
  @ApiResponse({ status: 201, description: 'Datos obtenidos con exito' })
  async porcentajeLenguaje(@Param('year', ParseIntPipe) year: number, @Param('id', ParseIntPipe) id: number, @Param('porcentaje', ParseIntPipe) porcentaje: number) {
    const cantByYearList = await this.graficosService.porcentajeLenguajeData(year, id, porcentaje);
    return {
      success: true,
      data: cantByYearList,
      message: 'Datos obtenidos con exito.',
    };
  }

  // !!!!!!!!!!!!!!!! ODONTOLOGIA

  @Get('porcentajeCepilladoPorAnio/:year/curso/:id/:porcentaje')
  @ApiOperation({ summary: '' })
  @ApiResponse({ status: 201, description: 'Datos obtenidos con exito' })
  async porcentajeCepillado(@Param('year', ParseIntPipe) year: number, @Param('id', ParseIntPipe) id: number, @Param('porcentaje', ParseIntPipe) porcentaje: number) {
    const cantByYearList = await this.graficosService.porcentajeCepilladoData(year, id, porcentaje);
    return {
      success: true,
      data: cantByYearList,
      message: 'Datos obtenidos con exito.',
    };
  }
  @Get('porcentajeTopificacionPorAnio/:year/curso/:id/:porcentaje')
  @ApiOperation({ summary: '' })
  @ApiResponse({ status: 201, description: 'Datos obtenidos con exito' })
  async porcentajeTopificacion(@Param('year', ParseIntPipe) year: number, @Param('id', ParseIntPipe) id: number, @Param('porcentaje', ParseIntPipe) porcentaje: number) {
    const cantByYearList = await this.graficosService.porcentajeTopificacionData(year, id, porcentaje);
    return {
      success: true,
      data: cantByYearList,
      message: 'Datos obtenidos con exito.',
    };
  }
  @Get('porcentajeSituacionBucalPorAnio/:year/curso/:id/:porcentaje')
  @ApiOperation({ summary: '' })
  @ApiResponse({ status: 201, description: 'Datos obtenidos con exito' })
  async porcentajeSituacionBucal(@Param('year', ParseIntPipe) year: number, @Param('id', ParseIntPipe) id: number, @Param('porcentaje', ParseIntPipe) porcentaje: number) {
    const cantByYearList = await this.graficosService.porcentajeSituacionBucalData(year, id, porcentaje);
    return {
      success: true,
      data: cantByYearList,
      message: 'Datos obtenidos con exito.',
    };
  }
  // A preguntar
  @Get('porcentajeSelladoPorAnio/:year/curso/:id/:porcentaje')
  @ApiOperation({ summary: '' })
  @ApiResponse({ status: 201, description: 'Datos obtenidos con exito' })
  async porcentajeSellado(@Param('year', ParseIntPipe) year: number, @Param('id', ParseIntPipe) id: number, @Param('porcentaje', ParseIntPipe) porcentaje: number) {
    const cantByYearList = await this.graficosService.porcentajeSelladoData(year, id, porcentaje);
    return {
      success: true,
      data: cantByYearList,
      message: 'Datos obtenidos con exito.',
    };
  }

  // !!!!!!!!!! OFTALMOLOGIA
  @Get('porcentajeAnteojosPorAnio/:year/curso/:id/:porcentaje')
  @ApiOperation({ summary: '' })
  @ApiResponse({ status: 201, description: 'Datos obtenidos con exito' })
  async porcentajeAnteojos(@Param('year', ParseIntPipe) year: number, @Param('id', ParseIntPipe) id: number, @Param('porcentaje', ParseIntPipe) porcentaje: number) {
    const cantByYearList = await this.graficosService.porcentajeAnteojosData(year, id, porcentaje);
    return {
      success: true,
      data: cantByYearList,
      message: 'Datos obtenidos con exito.',
    };
  }
  @Get('porcentajeDemandaPorAnio/:year/curso/:id/:porcentaje')
  @ApiOperation({ summary: '' })
  @ApiResponse({ status: 201, description: 'Datos obtenidos con exito' })
  async porcentajeDemanda(@Param('year', ParseIntPipe) year: number, @Param('id', ParseIntPipe) id: number, @Param('porcentaje', ParseIntPipe) porcentaje: number) {
    const cantByYearList = await this.graficosService.porcentajeDemandaData(year, id, porcentaje);
    return {
      success: true,
      data: cantByYearList,
      message: 'Datos obtenidos con exito.',
    };
  }
}
