import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { CursoService } from './curso.service';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('curso')
@UseGuards(JwtAuthGuard)
@ApiTags('curso')
export class CursoController {
  constructor(private readonly cursoService: CursoService) {}

  @Post()
  @ApiOperation({ summary: 'Crea un nuevo curso' })
  @ApiResponse({ status: 201, description: 'Curso creado con exito' })
  async create(@Body() createCursoDto: CreateCursoDto) {
    const curso = await this.cursoService.create(createCursoDto);
    return {
      success: true,
      data: curso,
      message: 'Curso creado con exito',
    };
  }

  @Get()
  @ApiOperation({ summary: 'Devuelve todas los cursos' })
  @ApiResponse({ status: 200, description: 'Retorna todas los cursos' })
  async findAll() {
    const cursos = await this.cursoService.findAll();
    return {
      success: true,
      data: cursos,
      message: 'Cursos encontrados con exito',
    };
  }

  @Get('habilitados')
  @ApiOperation({ summary: 'Devuelve todos los cursos habilitados' })
  @ApiResponse({ status: 200, description: 'Retorna todos los cursos habilitados con exito' })
  async findAllHabilitados() {
    const cursos = await this.cursoService.findAllHabilitados();
    return {
      success: true,
      data: cursos,
      message: 'Cursos encontrados con exito',
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Devuelve el curso buscado' })
  @ApiResponse({ status: 200, description: 'Retorna el curso buscado con exito' })
  @ApiResponse({ status: 404, description: 'Curso no encontrado' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const curso = await this.cursoService.findOne(id);
    return {
      success: true,
      data: curso,
      message: 'Curso encontrado con exito',
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualiza los datos de un curso' })
  @ApiResponse({ status: 200, description: 'Curso actualizado con exito' })
  @ApiResponse({ status: 404, description: 'Curso no encontrado' })
  @ApiResponse({ status: 400, description: 'No se enviaron cambios' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateCursoDto: UpdateCursoDto) {
    const cursoModificado = await this.cursoService.update(id, updateCursoDto);
    return {
      success: true,
      data: cursoModificado,
      message: 'Curso modificado con exito',
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Borrado logico de un curso' })
  @ApiResponse({ status: 200, description: 'Curso borrado logicamente con exito' })
  @ApiResponse({ status: 404, description: 'Curso no encontrado' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const cursoEliminado = await this.cursoService.remove(id);
    return {
      success: true,
      data: cursoEliminado,
      message: 'Curso eliminado con exito',
    };
  }
}
