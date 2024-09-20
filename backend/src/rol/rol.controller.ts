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
  async create(@Body() createRolDto: CreateRolDto) {
    const rol = await this.rolService.create(createRolDto);
    return {
      success: rol ? true : false,
      data: rol,
      message: rol ? 'Rol creado con exito' : 'Error',
    };
  }

  @Get()
  @ApiOperation({ summary: 'Devuelve todos los roles habilitados' })
  @ApiResponse({ status: 200, description: 'Retorna todas los roles habilitados con exito' })
  @ApiResponse({ status: 403, description: 'No permitido' })
  async findAll() {
    const colRoles = await this.rolService.findAll();
    return {
      success: colRoles ? true : false,
      data: colRoles,
      message: colRoles ? 'Roles obtenidos con exito' : 'Error',
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Devuelve el rol buscado' })
  @ApiResponse({ status: 200, description: 'Retorna el rol buscado con exito' })
  @ApiResponse({ status: 404, description: 'Rol no encontrado' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const rol = await this.rolService.findOne(id);
    return {
      success: rol ? true : false,
      data: rol,
      message: rol ? 'Rol obtenido con exito' : 'Error',
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualiza los datos de un rol' })
  @ApiResponse({ status: 200, description: 'Rol actualizado con exito' })
  @ApiResponse({ status: 404, description: 'Rol no encontrado' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateRolDto: UpdateRolDto) {
    const rolModificado = await this.rolService.update(id, updateRolDto);
    return {
      success: rolModificado ? true : false,
      data: rolModificado,
      message: rolModificado ? 'Rol modificado con exito' : 'Error',
    };
  }

  /*
  @Delete(':id')
  @ApiOperation({ summary: 'Borra un rol' })
  @ApiResponse({ status: 200, description: 'Rol borrado con exito' })
  @ApiResponse({ status: 404, description: 'Rol no encontrado' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const rolBorrado = await this.rolService.remove(id);
    return {
      success: true,
      data: rolBorrado,
      message:'Rol borrado con exito',
    };
  }
  */

  @Patch(':id/eliminar')
  @ApiOperation({ summary: 'Borrado logico de un rol' })
  @ApiResponse({ status: 200, description: 'Rol borrado logicamente con exito' })
  @ApiResponse({ status: 404, description: 'Rol no encontrado' })
  async borradoLogico(@Param('id', ParseIntPipe) id: number) {
    const rolBorradoLogico = await this.rolService.borradoLogico(id);
    return {
      success: rolBorradoLogico ? true : false,
      data: rolBorradoLogico,
      message: rolBorradoLogico ? 'Rol borrado logicamente con exito' : 'Error',
    };
  }
}
