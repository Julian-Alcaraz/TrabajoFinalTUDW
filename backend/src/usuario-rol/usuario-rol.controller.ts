import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { UsuarioRolService } from './usuario-rol.service';
import { CreateUsuarioRolDto } from './dto/create-usuario-rol.dto';

@Controller('usuario-rol')
@ApiTags('usuario-rol')
export class UsuarioRolController {
  constructor(private readonly usuarioRolService: UsuarioRolService) {}

  @Post()
  @ApiOperation({ summary: 'Crea un nuevo usuario-rol' })
  @ApiResponse({ status: 201, description: 'Usuario-rol creado con exito' })
  async create(@Body() createUsuarioRolDto: CreateUsuarioRolDto) {
    const usuarioRol = await this.usuarioRolService.create(createUsuarioRolDto);
    return {
      success: usuarioRol ? true : false,
      data: usuarioRol,
      message: usuarioRol ? 'UsuarioRol creado con exito' : 'Error',
    };
  }

  @Get()
  @ApiOperation({ summary: 'Devuelve todos los usuario-rol habilitados' })
  @ApiResponse({ status: 200, description: 'Retorna todas los usuario-rol habilitados con exito' })
  @ApiResponse({ status: 403, description: 'No permitido' })
  async findAll() {
    const colUsuarioRol = await this.usuarioRolService.findAll();
    return {
      success: colUsuarioRol ? true : false,
      data: colUsuarioRol,
      message: colUsuarioRol ? 'UsuarioRol obtenidos con exito' : 'Error',
    };
  }

  @Get(':idUsuario/:idRol')
  @ApiOperation({ summary: 'Devuelve el usuario-rol buscado' })
  @ApiResponse({ status: 200, description: 'Retorna el usuario-rol buscado con exito' })
  @ApiResponse({ status: 404, description: 'Usuario-rol no encontrado' })
  async findOne(@Param('idUsuario', ParseIntPipe) idUsuario: number, @Param('idRol', ParseIntPipe) idRol: number) {
    const usuarioRol = await this.usuarioRolService.findOne(idUsuario, idRol);
    return {
      success: usuarioRol ? true : false,
      data: usuarioRol,
      message: usuarioRol ? 'UsuarioRol obtenido con exito' : 'Error',
    };
  }

  @Delete(':idUsuario/:idRol')
  @ApiOperation({ summary: 'Borra un usuario-rol' })
  @ApiResponse({ status: 200, description: 'Usuario-rol borrado con exito' })
  @ApiResponse({ status: 404, description: 'Usuario-rol no encontrado' })
  async remove(@Param('idUsuario', ParseIntPipe) idUsuario: number, @Param('idRol', ParseIntPipe) idRol: number) {
    const usuarioRol = await this.usuarioRolService.remove(idUsuario, idRol);
    return {
      success: usuarioRol ? true : false,
      data: usuarioRol,
      message: usuarioRol ? 'UsuarioRol borrado con exito' : 'Error',
    };
  }

  /*
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsuarioRolDto: UpdateUsuarioRolDto) {
    return this.usuarioRolService.update(+id, updateUsuarioRolDto);
  }
  */
}
