import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

import { ConsultaService } from './consulta.service';
import { CreateConsultaDto } from './dto/create-consulta.dto';
import { UpdateConsultaDto } from './dto/update-consulta.dto';
import { GraficosService } from './graficos.service';
import { ResponseConsultaDto } from './dto/response-consulta.dto';
import { plainToInstance } from 'class-transformer';

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

  @Post('countBusquedaPersonalizada')
  @ApiOperation({ summary: 'Devuelte el total de consultas de una busqueda personalizada' })
  @ApiResponse({ status: 201, description: 'Consultas obtenidas con exito' })
  async countBusquedaPersonalizada(@Body() data: any) {
    const total = await this.consultaService.countBusquedaPersonalizadaLimited(data);
    return {
      success: true,
      data: total,
      message: 'Consultas contadas con exito.',
    };
  }

  @Post('busquedaPersonalizada/limited/:page/:size')
  @ApiOperation({ summary: 'Devuelte todas las consultas de una busqueda personalizada' })
  @ApiResponse({ status: 201, description: 'Consultas obtenidas con exito' })
  async busquedaPersonalizadaLimited(@Body() data: any, @Param('page', ParseIntPipe) page: number, @Param('size', ParseIntPipe) size: number) {
    const consultas = plainToInstance(ResponseConsultaDto, await this.consultaService.busquedaPersonalizadaLimited(data, page, size));
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
  @ApiOperation({ summary: 'Devuelve todas las consultas de un año especifico relacionadas con chico, curso e institución pero sin los datos por especialidad' })
  @ApiResponse({ status: 201, description: 'Consultas obtenidas con exito' })
  async findAllByYear(@Param('year', ParseIntPipe) year: number) {
    const consultas = plainToInstance(ResponseConsultaDto, await this.consultaService.findAllByYear(year));
    return {
      success: true,
      data: consultas,
      message: 'Consultas obtenidas con exito.',
    };
  }

  @Get('countTotalYear/:year')
  @ApiOperation({ summary: 'Devuelve el total por consulta' })
  @ApiResponse({ status: 201, description: 'Consultas obtenidas con exito' })
  async getTotalByYear(@Param('year', ParseIntPipe) year: number) {
    const total = await this.consultaService.countTotalByYear(year);
    return {
      success: true,
      data: total,
      message: 'Consultas obtenidas con exito.',
    };
  }

  @Get('year/:year/limited/:page/:size')
  @ApiOperation({ summary: 'Devuelve todas las consultas de un año especifico relacionadas con chico, curso e institución pero sin los datos por especialidad, limitada' })
  @ApiResponse({ status: 201, description: 'Consultas obtenidas con exito' })
  async findAllByYearLimited(@Param('year', ParseIntPipe) year: number, @Param('page', ParseIntPipe) page: number, @Param('size', ParseIntPipe) size: number) {
    const consultas = plainToInstance(ResponseConsultaDto, await this.consultaService.findAllByYearLimited(year, page, size));
    return {
      success: true,
      data: consultas,
      message: 'Consultas obtenidas con exito.',
    };
  }

  @Get('primeraVezChico/:id/:tipoConsulta')
  @ApiOperation({ summary: 'Devuelve si es la primera vez del chico en una consulta o no' })
  @ApiResponse({ status: 201, description: 'Consulta obtenida con exito' })
  async esPrimeraVez(@Param('id', ParseIntPipe) id: number, @Param('tipoConsulta') tipoConsulta: string) {
    const respuesta = await this.consultaService.esPrimeraVez(id, tipoConsulta);
    return {
      success: true,
      data: respuesta,
      message: 'Primera vez obtenida con exito.',
    };
  }

  @ApiOperation({ summary: 'Modifica y devuelte la consulta con los cambios enviados' })
  @ApiResponse({ status: 201, description: 'Consulta modificada con exito' })
  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateConsultaDto: UpdateConsultaDto) {
    const respuesta = plainToInstance(ResponseConsultaDto, await this.consultaService.update(id, updateConsultaDto));
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

  @Get('estadoNutricionalPorAnio/:year/curso/:id/institucion/:id_inst')
  @ApiOperation({ summary: '' })
  @ApiResponse({ status: 201, description: 'Datos obtenidos con exito' })
  async estadoNutricional(@Param('year', ParseIntPipe) year: number, @Param('id', ParseIntPipe) id: number, @Param('id_inst', ParseIntPipe) id_inst: number) {
    const cantByYearList = await this.graficosService.estadoNutricionalData(year, id, id_inst);
    return {
      success: true,
      data: cantByYearList,
      message: 'Datos obtenidos con exito.',
    };
  }

  @Get('tensionArterialPorAnio/:year/curso/:id/institucion/:id_inst')
  @ApiOperation({ summary: '' })
  @ApiResponse({ status: 201, description: 'Datos obtenidos con exito' })
  async tensionArterial(@Param('year', ParseIntPipe) year: number, @Param('id', ParseIntPipe) id: number, @Param('id_inst', ParseIntPipe) id_inst: number) {
    const cantByYearList = await this.graficosService.tensionArterialData(year, id, id_inst);
    return {
      success: true,
      data: cantByYearList,
      message: 'Datos obtenidos con exito.',
    };
  }

  @Post('tensionxEstadoPorAnio/:year/curso/:id/institucion/:id_inst')
  @ApiOperation({ summary: '' })
  @ApiResponse({ status: 201, description: 'Datos obtenidos con exito' })
  async tensionxEstado(@Body() data: any, @Param('year', ParseIntPipe) year: number, @Param('id', ParseIntPipe) id: number, @Param('id_inst', ParseIntPipe) id_inst: number) {
    const estado = data.estado;
    const cantByYearList = await this.graficosService.tensionxEstadoData(year, id, id_inst, estado);
    return {
      success: true,
      data: cantByYearList,
      message: 'Datos obtenidos con exito.',
    };
  }

  @Get('porcentajeEstadoNutricionalPorAnio/:year/curso/:id/institucion/:id_inst/:porcentaje')
  @ApiOperation({ summary: '' })
  @ApiResponse({ status: 201, description: 'Datos obtenidos con exito' })
  async porcentajeEstadoNutricional(@Param('year', ParseIntPipe) year: number, @Param('id', ParseIntPipe) id: number, @Param('id_inst', ParseIntPipe) id_inst: number, @Param('porcentaje', ParseIntPipe) porcentaje: number) {
    const cantByYearList = await this.graficosService.porcentajeEstadoNutricional(year, id, id_inst, porcentaje);
    return {
      success: true,
      data: cantByYearList,
      message: 'Datos obtenidos con exito.',
    };
  }

  @Get('porcentajeTensionArterialPorAnio/:year/curso/:id/institucion/:id_inst/:porcentaje')
  @ApiOperation({ summary: '' })
  @ApiResponse({ status: 201, description: 'Datos obtenidos con exito' })
  async porcentajeTensionArterial(@Param('year', ParseIntPipe) year: number, @Param('id', ParseIntPipe) id: number, @Param('id_inst', ParseIntPipe) id_inst: number, @Param('porcentaje', ParseIntPipe) porcentaje: number) {
    const cantByYearList = await this.graficosService.porcentajeTensionArterialData(year, id, id_inst, porcentaje);
    return {
      success: true,
      data: cantByYearList,
      message: 'Datos obtenidos con exito.',
    };
  }

  @Get('porcentajeExamenVisualPorAnio/:year/curso/:id/institucion/:id_inst/:porcentaje')
  @ApiOperation({ summary: '' })
  @ApiResponse({ status: 201, description: 'Datos obtenidos con exito' })
  async porcentajeExamenVisual(@Param('year', ParseIntPipe) year: number, @Param('id', ParseIntPipe) id: number, @Param('id_inst', ParseIntPipe) id_inst: number, @Param('porcentaje', ParseIntPipe) porcentaje: number) {
    const cantByYearList = await this.graficosService.porcentajeExamenVisualData(year, id, id_inst, porcentaje);
    return {
      success: true,
      data: cantByYearList,
      message: 'Datos obtenidos con exito.',
    };
  }
  @Get('porcentajeVacunacionPorAnio/:year/curso/:id/institucion/:id_inst/:porcentaje')
  @ApiOperation({ summary: '' })
  @ApiResponse({ status: 201, description: 'Datos obtenidos con exito' })
  async porcentajeVacunacion(@Param('year', ParseIntPipe) year: number, @Param('id', ParseIntPipe) id: number, @Param('id_inst', ParseIntPipe) id_inst: number, @Param('porcentaje', ParseIntPipe) porcentaje: number) {
    const cantByYearList = await this.graficosService.porcentajeVacunacionData(year, id, id_inst, porcentaje);
    return {
      success: true,
      data: cantByYearList,
      message: 'Datos obtenidos con exito.',
    };
  }
  @Get('porcentajeOrtopediaPorAnio/:year/curso/:id/institucion/:id_inst/:porcentaje')
  @ApiOperation({ summary: '' })
  @ApiResponse({ status: 201, description: 'Datos obtenidos con exito' })
  async porcentajeOrtopedia(@Param('year', ParseIntPipe) year: number, @Param('id', ParseIntPipe) id: number, @Param('id_inst', ParseIntPipe) id_inst: number, @Param('porcentaje', ParseIntPipe) porcentaje: number) {
    const cantByYearList = await this.graficosService.porcentajeOrtopediaData(year, id, id_inst, porcentaje);
    return {
      success: true,
      data: cantByYearList,
      message: 'Datos obtenidos con exito.',
    };
  }
  @Get('porcentajeLenguajePorAnio/:year/curso/:id/institucion/:id_inst/:porcentaje')
  @ApiOperation({ summary: '' })
  @ApiResponse({ status: 201, description: 'Datos obtenidos con exito' })
  async porcentajeLenguaje(@Param('year', ParseIntPipe) year: number, @Param('id', ParseIntPipe) id: number, @Param('id_inst', ParseIntPipe) id_inst: number, @Param('porcentaje', ParseIntPipe) porcentaje: number) {
    const cantByYearList = await this.graficosService.porcentajeLenguajeData(year, id, id_inst, porcentaje);
    return {
      success: true,
      data: cantByYearList,
      message: 'Datos obtenidos con exito.',
    };
  }

  // !!!!!!!!!!!!!!!! ODONTOLOGIA
  // @Get('countAnteojosPorAnio/:year/curso/:id')
  // @ApiOperation({ summary: '' })
  // @ApiResponse({ status: 201, description: 'Datos obtenidos con exito' })
  // async countAnteojos(@Param('year', ParseIntPipe) year: number, @Param('id', ParseIntPipe) id: number) {
  //   const cantByYearList = await this.graficosService.anteojosData(year, id);
  //   return {
  //     success: true,
  //     data: cantByYearList,
  //     message: 'Datos obtenidos con exito.',
  //   };
  // }

  @Get('countCepilladoPorAnio/:year/curso/:id/institucion/:id_inst')
  @ApiOperation({ summary: '' })
  @ApiResponse({ status: 201, description: 'Datos obtenidos con exito' })
  async countCepillado(@Param('year', ParseIntPipe) year: number, @Param('id', ParseIntPipe) id: number, @Param('id_inst', ParseIntPipe) id_inst: number) {
    const cantByYearList = await this.graficosService.cepilladoData(year, id, id_inst);
    return {
      success: true,
      data: cantByYearList,
      message: 'Datos obtenidos con exito.',
    };
  }
  @Get('countTopificacionPorAnio/:year/curso/:id/institucion/:id_inst')
  @ApiOperation({ summary: '' })
  @ApiResponse({ status: 201, description: 'Datos obtenidos con exito' })
  async countTopificacion(@Param('year', ParseIntPipe) year: number, @Param('id', ParseIntPipe) id: number, @Param('id_inst', ParseIntPipe) id_inst: number) {
    const cantByYearList = await this.graficosService.topificacionData(year, id, id_inst);
    return {
      success: true,
      data: cantByYearList,
      message: 'Datos obtenidos con exito.',
    };
  }
  @Get('countSituacionBucalPorAnio/:year/curso/:id/institucion/:id_inst')
  @ApiOperation({ summary: '' })
  @ApiResponse({ status: 201, description: 'Datos obtenidos con exito' })
  async countSituacionBucal(@Param('year', ParseIntPipe) year: number, @Param('id', ParseIntPipe) id: number, @Param('id_inst', ParseIntPipe) id_inst: number) {
    const cantByYearList = await this.graficosService.situacionBucalData(year, id, id_inst);
    return {
      success: true,
      data: cantByYearList,
      message: 'Datos obtenidos con exito.',
    };
  }
  // A preguntar
  @Get('countSelladoPorAnio/:year/curso/:id/institucion/:id_inst')
  @ApiOperation({ summary: '' })
  @ApiResponse({ status: 201, description: 'Datos obtenidos con exito' })
  async countSellado(@Param('year', ParseIntPipe) year: number, @Param('id', ParseIntPipe) id: number, @Param('id_inst', ParseIntPipe) id_inst: number) {
    const cantByYearList = await this.graficosService.selladoData(year, id, id_inst);
    return {
      success: true,
      data: cantByYearList,
      message: 'Datos obtenidos con exito.',
    };
  }

  @Get('porcentajeCepilladoPorAnio/:year/curso/:id/institucion/:id_inst/:porcentaje')
  @ApiOperation({ summary: '' })
  @ApiResponse({ status: 201, description: 'Datos obtenidos con exito' })
  async porcentajeCepillado(@Param('year', ParseIntPipe) year: number, @Param('id', ParseIntPipe) id: number, @Param('id_inst', ParseIntPipe) id_inst: number, @Param('porcentaje', ParseIntPipe) porcentaje: number) {
    const cantByYearList = await this.graficosService.porcentajeCepilladoData(year, id, id_inst, porcentaje);
    return {
      success: true,
      data: cantByYearList,
      message: 'Datos obtenidos con exito.',
    };
  }
  @Get('porcentajeTopificacionPorAnio/:year/curso/:id/institucion/:id_inst/:porcentaje')
  @ApiOperation({ summary: '' })
  @ApiResponse({ status: 201, description: 'Datos obtenidos con exito' })
  async porcentajeTopificacion(@Param('year', ParseIntPipe) year: number, @Param('id', ParseIntPipe) id: number, @Param('id_inst', ParseIntPipe) id_inst: number, @Param('porcentaje', ParseIntPipe) porcentaje: number) {
    const cantByYearList = await this.graficosService.porcentajeTopificacionData(year, id, id_inst, porcentaje);
    return {
      success: true,
      data: cantByYearList,
      message: 'Datos obtenidos con exito.',
    };
  }
  @Get('porcentajeSituacionBucalPorAnio/:year/curso/:id/institucion/:id_inst/:porcentaje')
  @ApiOperation({ summary: '' })
  @ApiResponse({ status: 201, description: 'Datos obtenidos con exito' })
  async porcentajeSituacionBucal(@Param('year', ParseIntPipe) year: number, @Param('id', ParseIntPipe) id: number, @Param('id_inst', ParseIntPipe) id_inst: number, @Param('porcentaje', ParseIntPipe) porcentaje: number) {
    const cantByYearList = await this.graficosService.porcentajeSituacionBucalData(year, id, id_inst, porcentaje);
    return {
      success: true,
      data: cantByYearList,
      message: 'Datos obtenidos con exito.',
    };
  }
  // A preguntar
  @Get('porcentajeSelladoPorAnio/:year/curso/:id/institucion/:id_inst/:porcentaje')
  @ApiOperation({ summary: '' })
  @ApiResponse({ status: 201, description: 'Datos obtenidos con exito' })
  async porcentajeSellado(@Param('year', ParseIntPipe) year: number, @Param('id', ParseIntPipe) id: number, @Param('id_inst', ParseIntPipe) id_inst: number, @Param('porcentaje', ParseIntPipe) porcentaje: number) {
    const cantByYearList = await this.graficosService.porcentajeSelladoData(year, id, id_inst, porcentaje);
    return {
      success: true,
      data: cantByYearList,
      message: 'Datos obtenidos con exito.',
    };
  }

  // !!!!!!!!!! OFTALMOLOGIA
  @Get('countAnteojosPorAnio/:year/curso/:id/institucion/:id_inst')
  @ApiOperation({ summary: '' })
  @ApiResponse({ status: 201, description: 'Datos obtenidos con exito' })
  async countAnteojos(@Param('year', ParseIntPipe) year: number, @Param('id', ParseIntPipe) id: number, @Param('id_inst', ParseIntPipe) id_inst: number) {
    const cantByYearList = await this.graficosService.anteojosData(year, id, id_inst);
    return {
      success: true,
      data: cantByYearList,
      message: 'Datos obtenidos con exito.',
    };
  }
  @Get('countDemandaPorAnio/:year/curso/:id/institucion/:id_inst')
  @ApiOperation({ summary: '' })
  @ApiResponse({ status: 201, description: 'Datos obtenidos con exito' })
  async countDemanda(@Param('year', ParseIntPipe) year: number, @Param('id', ParseIntPipe) id: number, @Param('id_inst', ParseIntPipe) id_inst: number) {
    const cantByYearList = await this.graficosService.demandaData(year, id, id_inst);
    return {
      success: true,
      data: cantByYearList,
      message: 'Datos obtenidos con exito.',
    };
  }

  @Get('porcentajeAnteojosPorAnio/:year/curso/:id/institucion/:id_inst/:porcentaje')
  @ApiOperation({ summary: '' })
  @ApiResponse({ status: 201, description: 'Datos obtenidos con exito' })
  async porcentajeAnteojos(@Param('year', ParseIntPipe) year: number, @Param('id', ParseIntPipe) id: number, @Param('id_inst', ParseIntPipe) id_inst: number, @Param('porcentaje', ParseIntPipe) porcentaje: number) {
    const cantByYearList = await this.graficosService.porcentajeAnteojosData(year, id, id_inst, porcentaje);
    return {
      success: true,
      data: cantByYearList,
      message: 'Datos obtenidos con exito.',
    };
  }
  @Get('porcentajeDemandaPorAnio/:year/curso/:id/institucion/:id_inst/:porcentaje')
  @ApiOperation({ summary: '' })
  @ApiResponse({ status: 201, description: 'Datos obtenidos con exito' })
  async porcentajeDemanda(@Param('year', ParseIntPipe) year: number, @Param('id', ParseIntPipe) id: number, @Param('id_inst', ParseIntPipe) id_inst: number, @Param('porcentaje', ParseIntPipe) porcentaje: number) {
    const cantByYearList = await this.graficosService.porcentajeDemandaData(year, id, id_inst, porcentaje);
    return {
      success: true,
      data: cantByYearList,
      message: 'Datos obtenidos con exito.',
    };
  }

  // PREVENCION
  @Get('drogaHabitualPorAnio/:year/curso/:id/institucion/:id_inst')
  @ApiOperation({ summary: '' })
  @ApiResponse({ status: 201, description: 'Datos obtenidos con exito' })
  async drogaHabitual(@Param('year', ParseIntPipe) year: number, @Param('id', ParseIntPipe) id: number, @Param('id_inst', ParseIntPipe) id_inst: number) {
    const cantByYearList = await this.graficosService.drogasHabituales(year, id, id_inst);
    return {
      success: true,
      data: cantByYearList,
      message: 'Datos obtenidos con exito.',
    };
  }
  @Get('problematicaPorAnio/:year/curso/:id/institucion/:id_inst')
  @ApiOperation({ summary: '' })
  @ApiResponse({ status: 201, description: 'Datos obtenidos con exito' })
  async problematica(@Param('year', ParseIntPipe) year: number, @Param('id', ParseIntPipe) id: number, @Param('id_inst', ParseIntPipe) id_inst: number) {
    const cantByYearList = await this.graficosService.problematica(year, id, id_inst);
    return {
      success: true,
      data: cantByYearList,
      message: 'Datos obtenidos con exito.',
    };
  }
  @Get('frecuenciaPorAnio/:year/curso/:id/institucion/:id_inst')
  @ApiOperation({ summary: '' })
  @ApiResponse({ status: 201, description: 'Datos obtenidos con exito' })
  async frecuencia(@Param('year', ParseIntPipe) year: number, @Param('id', ParseIntPipe) id: number, @Param('id_inst', ParseIntPipe) id_inst: number) {
    const cantByYearList = await this.graficosService.frecuenciaConsumo(year, id, id_inst);
    return {
      success: true,
      data: cantByYearList,
      message: 'Datos obtenidos con exito.',
    };
  }
  @Get('motivoPorAnio/:year/curso/:id/institucion/:id_inst')
  @ApiOperation({ summary: '' })
  @ApiResponse({ status: 201, description: 'Datos obtenidos con exito' })
  async motivo(@Param('year', ParseIntPipe) year: number, @Param('id', ParseIntPipe) id: number, @Param('id_inst', ParseIntPipe) id_inst: number) {
    const cantByYearList = await this.graficosService.motivoConsumo(year, id, id_inst);
    return {
      success: true,
      data: cantByYearList,
      message: 'Datos obtenidos con exito.',
    };
  }

  @Get('porcentajeFrecuenciaConsumoPorAnio/:year/curso/:id/institucion/:id_inst/:porcentaje')
  @ApiOperation({ summary: '' })
  @ApiResponse({ status: 201, description: 'Datos obtenidos con exito' })
  async porcentajeFrecuenciaConsumo(@Param('year', ParseIntPipe) year: number, @Param('id', ParseIntPipe) id: number, @Param('id_inst', ParseIntPipe) id_inst: number, @Param('porcentaje', ParseIntPipe) porcentaje: number) {
    const cantByYearList = await this.graficosService.porcentajeFrecuenciaConsumo(year, id, id_inst, porcentaje);
    return {
      success: true,
      data: cantByYearList,
      message: 'Datos obtenidos con exito.',
    };
  }
  @Get('porcentajeMotivoConsumoPorAnio/:year/curso/:id/institucion/:id_inst/:porcentaje')
  @ApiOperation({ summary: '' })
  @ApiResponse({ status: 201, description: 'Datos obtenidos con exito' })
  async porcentajeMotivoConsumo(@Param('year', ParseIntPipe) year: number, @Param('id', ParseIntPipe) id: number, @Param('id_inst', ParseIntPipe) id_inst: number, @Param('porcentaje', ParseIntPipe) porcentaje: number) {
    const cantByYearList = await this.graficosService.porcentajeMotivoConsumo(year, id, id_inst, porcentaje);
    return {
      success: true,
      data: cantByYearList,
      message: 'Datos obtenidos con exito.',
    };
  }
  @Get('porcentajeDrogasHabitualesPorAnio/:year/curso/:id/institucion/:id_inst/:porcentaje')
  @ApiOperation({ summary: '' })
  @ApiResponse({ status: 201, description: 'Datos obtenidos con exito' })
  async porcentajeDrogasHabituales(@Param('year', ParseIntPipe) year: number, @Param('id', ParseIntPipe) id: number, @Param('id_inst', ParseIntPipe) id_inst: number, @Param('porcentaje', ParseIntPipe) porcentaje: number) {
    const cantByYearList = await this.graficosService.porcentajeDrogasHabituales(year, id, id_inst, porcentaje);
    return {
      success: true,
      data: cantByYearList,
      message: 'Datos obtenidos con exito.',
    };
  }
  @Get('porcentajeProblematicaPorAnio/:year/curso/:id/institucion/:id_inst/:porcentaje')
  @ApiOperation({ summary: '' })
  @ApiResponse({ status: 201, description: 'Datos obtenidos con exito' })
  async porcentajeProblematica(@Param('year', ParseIntPipe) year: number, @Param('id', ParseIntPipe) id: number, @Param('id_inst', ParseIntPipe) id_inst: number, @Param('porcentaje', ParseIntPipe) porcentaje: number) {
    const cantByYearList = await this.graficosService.porcentajeProblematica(year, id, id_inst, porcentaje);
    return {
      success: true,
      data: cantByYearList,
      message: 'Datos obtenidos con exito.',
    };
  }
  // FONOAUDIOLOGIA
  @Get('porcentajeCausasPorAnio/:year/curso/:id/institucion/:id_inst/:porcentaje')
  @ApiOperation({ summary: '' })
  @ApiResponse({ status: 201, description: 'Datos obtenidos con exito' })
  async porcentajeCausa(@Param('year', ParseIntPipe) year: number, @Param('id', ParseIntPipe) id: number, @Param('id_inst', ParseIntPipe) id_inst: number, @Param('porcentaje', ParseIntPipe) porcentaje: number) {
    const cantByYearList = await this.graficosService.porcentajeCausas(year, id, id_inst, porcentaje);
    return {
      success: true,
      data: cantByYearList,
      message: 'Datos obtenidos con exito.',
    };
  }
  @Get('causasPorAnio/:year/curso/:id/institucion/:id_inst')
  @ApiOperation({ summary: '' })
  @ApiResponse({ status: 201, description: 'Datos obtenidos con exito' })
  async causas(@Param('year', ParseIntPipe) year: number, @Param('id', ParseIntPipe) id: number, @Param('id_inst', ParseIntPipe) id_inst: number) {
    const cantByYearList = await this.graficosService.causas(year, id, id_inst);
    return {
      success: true,
      data: cantByYearList,
      message: 'Datos obtenidos con exito.',
    };
  }
  @Get('porcentajeDiagnosticoPresuntivoPorAnio/:year/curso/:id/institucion/:id_inst/:porcentaje')
  @ApiOperation({ summary: '' })
  @ApiResponse({ status: 201, description: 'Datos obtenidos con exito' })
  async porcentajeDiagnosticoPresuntivo(@Param('year', ParseIntPipe) year: number, @Param('id', ParseIntPipe) id: number, @Param('id_inst', ParseIntPipe) id_inst: number, @Param('porcentaje', ParseIntPipe) porcentaje: number) {
    const cantByYearList = await this.graficosService.porcentajeDiagnosticoPresuntivo(year, id, id_inst, porcentaje);
    return {
      success: true,
      data: cantByYearList,
      message: 'Datos obtenidos con exito.',
    };
  }
  @Get('diagnosticoPresuntivoPorAnio/:year/curso/:id/institucion/:id_inst')
  @ApiOperation({ summary: '' })
  @ApiResponse({ status: 201, description: 'Datos obtenidos con exito' })
  async diagnosticoPresuntivo(@Param('year', ParseIntPipe) year: number, @Param('id', ParseIntPipe) id: number, @Param('id_inst', ParseIntPipe) id_inst: number) {
    const cantByYearList = await this.graficosService.diagnosticoPresuntivo(year, id, id_inst);
    return {
      success: true,
      data: cantByYearList,
      message: 'Datos obtenidos con exito.',
    };
  }

  @Get('countConsultasByCategoria/:year/curso/:id/institucion/:id_inst/:porcentaje')
  @ApiOperation({ summary: '' })
  @ApiResponse({ status: 201, description: 'Datos obtenidos con exito' })
  async countConsultasByCategoria(@Param('year', ParseIntPipe) year: number, @Param('id', ParseIntPipe) id: number, @Param('id_inst', ParseIntPipe) id_inst: number, @Param('porcentaje', ParseIntPipe) porcentaje: number) {
    const resultado = await this.graficosService.countConsultasByCategoria(year, id, id_inst, porcentaje);
    return {
      success: true,
      data: resultado,
      message: 'Datos obtenidos con exito.',
    };
  }
}
