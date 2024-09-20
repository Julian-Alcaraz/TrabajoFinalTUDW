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
  create(@Body() createUsuarioRolDto: CreateUsuarioRolDto) {
    return this.usuarioRolService.create(createUsuarioRolDto);
  }

  @Get()
  @ApiOperation({ summary: 'Devuelve todos los usuario-rol habilitados' })
  @ApiResponse({ status: 200, description: 'Retorna todas los usuario-rol habilitados con exito' })
  @ApiResponse({ status: 403, description: 'No permitido' })
  findAll() {
    return this.usuarioRolService.findAll();
  }

  @Get(':idUsuario/:idRol')
  @ApiOperation({ summary: 'Devuelve el usuario-rol buscado' })
  @ApiResponse({ status: 200, description: 'Retorna el usuario-rol buscado con exito' })
  @ApiResponse({ status: 404, description: 'Usuario-rol no encontrado' })
  async findOne(@Param('idUsuario', ParseIntPipe) idUsuario: number, @Param('idRol', ParseIntPipe) idRol: number) {
    return this.usuarioRolService.findOne(idUsuario, idRol);
  }

  /*
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsuarioRolDto: UpdateUsuarioRolDto) {
    return this.usuarioRolService.update(+id, updateUsuarioRolDto);
  }
  */

  @Delete(':idUsuario/:idRol')
  @ApiOperation({ summary: 'Borra un usuario-rol' })
  @ApiResponse({ status: 200, description: 'Usuario-rol borrado con exito' })
  @ApiResponse({ status: 404, description: 'Usuario-rol no encontrado' })
  async remove(@Param('idUsuario', ParseIntPipe) idUsuario: number, @Param('idRol', ParseIntPipe) idRol: number) {
    return this.usuarioRolService.remove(idUsuario, idRol);
  }
}
