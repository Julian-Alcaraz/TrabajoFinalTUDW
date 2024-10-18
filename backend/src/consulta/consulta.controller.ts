import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Req, UseGuards } from '@nestjs/common';
import { ConsultaService } from './consulta.service';
import { CreateConsultaDto } from './dto/create-consulta.dto';
import { UpdateConsultaDto } from './dto/update-consulta.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('consulta')
@UseGuards(JwtAuthGuard)
export class ConsultaController {
  constructor(private readonly consultaService: ConsultaService) {}

  @Post()
  @ApiOperation({ summary: 'Crea una nueva consulta' })
  @ApiResponse({ status: 201, description: 'Consulta creada con exito' })
  async create(@Body() createConsultaDto: CreateConsultaDto, @Req() req: any) {
    const consulta = await this.consultaService.create(createConsultaDto, req.user);
    return {
      succes: true,
      data: consulta,
      message: `Consulta ${createConsultaDto.type} cargada con exito.`,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Devuelte todas las consultas sin los datos por especialidad' })
  @ApiResponse({ status: 201, description: 'Consultas obtenidas con exito' })
  async findAll() {
    const consultas = await this.consultaService.findAll();
    return {
      succes: true,
      data: consultas,
      message: 'Consultas obtenidas con exito.',
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Devuelte una consulta con todos sus datos' })
  @ApiResponse({ status: 201, description: 'Consulta obtenida con exito' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.consultaService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateConsultaDto: UpdateConsultaDto) {
    return this.consultaService.update(+id, updateConsultaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.consultaService.remove(+id);
  }
}
