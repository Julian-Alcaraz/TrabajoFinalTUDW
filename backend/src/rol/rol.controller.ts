import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { RolService } from './rol.service';
import { CreateRolDto } from './dto/create-rol.dto';
import { UpdateRolDto } from './dto/update-rol.dto';

@Controller('rol')
@ApiTags('rol')
export class RolController {
  constructor(private readonly rolService: RolService) {}

  @Post()
  @ApiOperation({ summary: 'Crea un nuevo rol' })
  @ApiResponse({ status: 201, description: 'Rol creado con exito' })
  create(@Body() createRolDto: CreateRolDto) {
    return this.rolService.create(createRolDto);
  }

  @Get()
  @ApiOperation({ summary: 'Devuelve todos los roles habilitados' })
  @ApiResponse({ status: 200, description: 'Retorna todas los roles habilitados con exito' })
  @ApiResponse({ status: 403, description: 'No permitido' })
  findAll() {
    return this.rolService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Devuelve el rol buscado' })
  @ApiResponse({ status: 200, description: 'Retorna el rol buscado con exito' })
  @ApiResponse({ status: 404, description: 'Rol no encontrado' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.rolService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualiza los datos de un rol' })
  @ApiResponse({ status: 200, description: 'Rol actualizado con exito' })
  @ApiResponse({ status: 404, description: 'Rol no encontrado' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateRolDto: UpdateRolDto) {
    return this.rolService.update(id, updateRolDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Borra un rol' })
  @ApiResponse({ status: 200, description: 'Rol borrado con exito' })
  @ApiResponse({ status: 404, description: 'Rol no encontrado' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.rolService.remove(id);
  }

  @Patch(':id/eliminar')
  @ApiOperation({ summary: 'Borrado logico de un rol' })
  @ApiResponse({ status: 200, description: 'Rol borrado logicamente con exito' })
  @ApiResponse({ status: 404, description: 'Rol no encontrado' })
  async borradoLogico(@Param('id', ParseIntPipe) id: number) {
    return this.rolService.borradoLogico(id);
  }
}
