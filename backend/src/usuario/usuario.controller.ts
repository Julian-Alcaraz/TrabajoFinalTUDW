import { Controller, Get, Post, Body, Patch, Param, ParseIntPipe, Delete, Put, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('usuario')
@UseGuards(JwtAuthGuard)
@ApiTags('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  @ApiOperation({ summary: 'Crea un nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario creado con exito' })
  @ApiResponse({ status: 400, description: 'El dni del usuario ya esta cargado en el sistema' })
  @ApiResponse({ status: 400, description: 'El email del usuario ya esta cargado en el sistema' })
  async create(@Body() createUsuarioDto: CreateUsuarioDto) {
    const usuario = await this.usuarioService.create(createUsuarioDto);
    return {
      success: true,
      data: usuario,
      message: 'Usuario creado con exito',
    };
  }

  @Get()
  @ApiOperation({ summary: 'Devuelve todos los usuarios ' })
  @ApiResponse({ status: 200, description: 'Retorna todos los usuarios habilitados con exito' })
  async findAll() {
    const colUsuarios = await this.usuarioService.findAll();
    return {
      success: true,
      data: colUsuarios,
      message: 'Usuarios obtenidos con exito',
    };
  }

  @Get('profesionales')
  @ApiOperation({ summary: 'Devuelve todos los usuarios solo con el rol de profesional' })
  @ApiResponse({ status: 200, description: 'Usuarios devueltos con exito' })
  async usuariosProfesionales() {
    const usuariosProfesionales = await this.usuarioService.usuariosProfesionales();
    return {
      success: true,
      data: usuariosProfesionales,
      message: 'Usuarios profesionales retornados con exito',
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Devuelve el usuario buscado' })
  @ApiResponse({ status: 200, description: 'Retorna el usuario buscado con exito' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const colUsuarios = await this.usuarioService.findOne(id);
    return {
      success: true,
      data: colUsuarios,
      message: 'Usuario obtenido con exito',
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualiza los datos de un usuario' })
  @ApiResponse({ status: 200, description: 'Usuario actualizado con exito' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiResponse({ status: 400, description: 'No se enviaron cambios' })
  @ApiResponse({ status: 400, description: 'El dni del usuario ya esta cargado en el sistema' })
  @ApiResponse({ status: 400, description: 'El email del usuario ya esta cargado en el sistema' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    const usuarioModificado = await this.usuarioService.update(id, updateUsuarioDto);
    return {
      success: true,
      data: usuarioModificado,
      message: 'Usuario modificado con exito',
    };
  }

  @Delete('eliminar/:id')
  @ApiOperation({ summary: 'Borrado logico de un usuario' })
  @ApiResponse({ status: 200, description: 'Usuario borrado logicamente con exito' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const usuarioBorrado = await this.usuarioService.remove(id);
    return {
      success: true,
      data: usuarioBorrado,
      message: 'Usuario borrado logicamente con exito',
    };
  }

  @Delete(':idUsuario/rol/:idRol')
  @ApiOperation({ summary: 'Borrado de un rol relacionado a un usuario' })
  @ApiResponse({ status: 200, description: 'Rol relacionado al usuario borrado con exito' })
  @ApiResponse({ status: 404, description: 'Usuario con no encontrado' })
  @ApiResponse({ status: 404, description: 'El rol no esta asignado al usuario' })
  @ApiResponse({ status: 400, description: 'Un usuario no puede quedarse sin roles' })
  async eliminarRolDeUsuario(@Param('idUsuario', ParseIntPipe) idUsuario: number, @Param('idRol', ParseIntPipe) idRol: number) {
    const resultado = await this.usuarioService.eliminarRolDeUsuario(idUsuario, idRol);
    return {
      success: true,
      data: resultado,
      message: 'Rol del usuario borrado con exito',
    };
  }

  @Put(':idUsuario/rol/:idRol')
  @ApiOperation({ summary: 'Agregar un rol relacionado al usuario' })
  @ApiResponse({ status: 404, description: 'Usuario con no encontrado' })
  @ApiResponse({ status: 404, description: 'Rol con no encontrado' })
  @ApiResponse({ status: 400, description: 'El usuario ya tiene ese rol' })
  async agregarRolDeUsuario(@Param('idUsuario', ParseIntPipe) idUsuario: number, @Param('idRol', ParseIntPipe) idRol: number) {
    const resultado = await this.usuarioService.agregarRolDeUsuario(idUsuario, idRol);
    return {
      success: true,
      data: resultado,
      message: 'Rol del usuario asignado con exito',
    };
  }

  @Get('menus/:id')
  @ApiOperation({ summary: 'Devuelve todos los menus segun el id de un usuario' })
  @ApiResponse({ status: 200, description: 'Menus devueltos con exito' })
  async menusDeUsuario(@Param('id', ParseIntPipe) id: number) {
    const menusDelUsuario = await this.usuarioService.menusDeUsuario(id);
    return {
      success: true,
      data: menusDelUsuario,
      message: 'Menus del usuario retornados con exito',
    };
  }

  /*
  @Delete(':id')
  @ApiOperation({ summary: 'Borrado logico de un usuario' })
  @ApiResponse({ status: 200, description: 'Usuario borrado logicamente con exito' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.usuarioService.remove(id);
  }
  */
}
