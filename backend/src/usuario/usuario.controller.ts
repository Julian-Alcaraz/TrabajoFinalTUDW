import { Controller, Get, Post, Body, Patch, Param, ParseIntPipe } from '@nestjs/common';
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
  @ApiResponse({ status: 400, description: 'El dni del usuario ya esta cargado en el sistema' })
  @ApiResponse({ status: 400, description: 'El email del usuario ya esta cargado en el sistema' })
  async create(@Body() createUsuarioDto: CreateUsuarioDto) {
    const usuario = await this.usuarioService.create(createUsuarioDto);
    return {
      success: usuario ? true : false,
      data: usuario,
      message: usuario ? 'Usuario creado con exito' : 'Error',
    };
  }

  @Get()
  @ApiOperation({ summary: 'Devuelve todos los usuarios habilitados' })
  @ApiResponse({ status: 200, description: 'Retorna todas los usuarios habilitados con exito' })
  @ApiResponse({ status: 403, description: 'No permitido' })
  async findAll() {
    const colUsuarios = await this.usuarioService.findAll();
    return {
      success: colUsuarios ? true : false,
      data: colUsuarios,
      message: colUsuarios ? 'Usuarios obtenidos con exito' : 'Error',
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Devuelve el usuario buscado' })
  @ApiResponse({ status: 200, description: 'Retorna el usuario buscado con exito' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const colUsuarios = await this.usuarioService.findOne(id);
    return {
      success: colUsuarios ? true : false,
      data: colUsuarios,
      message: colUsuarios ? 'Usuario obtenido con exito' : 'Error',
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
      success: usuarioModificado ? true : false,
      data: usuarioModificado,
      message: usuarioModificado ? 'Usuario modificado con exito' : 'Error',
    };
  }

  @Patch('eliminar/:id')
  @ApiOperation({ summary: 'Borrado logico de un usuario' })
  @ApiResponse({ status: 200, description: 'Usuario borrado logicamente con exito' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async borradoLogico(@Param('id', ParseIntPipe) id: number) {
    const usuarioBorradoLogico = await this.usuarioService.borradoLogico(id);
    return {
      success: usuarioBorradoLogico ? true : false,
      data: usuarioBorradoLogico,
      message: usuarioBorradoLogico ? 'Usuario borrado logicamente con exito' : 'Error',
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
