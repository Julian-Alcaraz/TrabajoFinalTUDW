import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

import { ConsultaService } from './consulta.service';
import { CreateConsultaDto } from './dto/create-consulta.dto';
import { UpdateConsultaDto } from './dto/update-consulta.dto';

@Controller('consulta')
// @UseGuards(JwtAuthGuard)
export class ConsultaController {
  constructor(private readonly consultaService: ConsultaService) {}

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
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.consultaService.remove(id);
  }

  @Get('contarXanios/:year')
  @ApiOperation({ summary: 'Cuenta todas las consultas por año de los ultimos 4' })
  @ApiResponse({ status: 201, description: 'Consulta obtenida con exito' })
  async countByYear(@Param('year', ParseIntPipe) year: number) {
    const cantByYearList = await this.consultaService.countByYear(year);
    return {
      success: true,
      data: cantByYearList,
      message: 'Primera vez obtenida con exito.',
    };
  }

  @Get('contarTipoXanios/:year')
  @ApiOperation({ summary: 'Cuenta todas las consultas por año de los ultimos 4' })
  @ApiResponse({ status: 201, description: 'Consulta obtenida con exito' })
  async countTypeByYear(@Param('year', ParseIntPipe) year: number) {
    const cantByYearList = await this.consultaService.countTypeByYear(year);
    return {
      success: true,
      data: cantByYearList,
      message: 'Primera vez obtenida con exito.',
    };
  }
}
