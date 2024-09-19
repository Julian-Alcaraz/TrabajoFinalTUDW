import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Controller('usuario')
@ApiTags('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  @ApiOperation({ summary: 'Crea un nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario creado con exito' })
  async create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuarioService.create(createUsuarioDto);
  }

  @Get()
  @ApiOperation({ summary: 'Devuelve todos los usuarios habilitados' })
  @ApiResponse({ status: 200, description: 'Retorna todas los usuarios habilitados con exito' })
  @ApiResponse({ status: 403, description: 'No permitido' })
  findAll() {
    return this.usuarioService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Devuelve el usuario buscado' })
  @ApiResponse({ status: 200, description: 'Retorna el usuario buscado con exito' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usuarioService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualiza los datos de un usuario' })
  @ApiResponse({ status: 200, description: 'Usuario actualizado con exito' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuarioService.update(id, updateUsuarioDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Borrado logico de un usuario' })
  @ApiResponse({ status: 200, description: 'Usuario borrado logicamente con exito' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.usuarioService.remove(id);
  }

  @Patch(':id/eliminar')
  @ApiOperation({ summary: 'Borrado logico de un usuario' })
  @ApiResponse({ status: 200, description: 'Usuario borrado logicamente con exito' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async borradoLogico(@Param('id', ParseIntPipe) id: number) {
    return this.usuarioService.borradoLogico(id);
  }
}
