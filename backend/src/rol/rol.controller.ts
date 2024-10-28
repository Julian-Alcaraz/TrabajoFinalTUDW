import { Controller, Get, Post, Body, Patch, Param, ParseIntPipe, Delete, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { RolService } from './rol.service';
import { CreateRolDto } from './dto/create-rol.dto';
import { UpdateRolDto } from './dto/update-rol.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('rol')
@UseGuards(JwtAuthGuard)
@ApiTags('rol')
export class RolController {
  constructor(private readonly rolService: RolService) {}

  @Post()
  @ApiOperation({ summary: 'Crea un nuevo rol' })
  @ApiResponse({ status: 201, description: 'Rol creado con exito' })
  async create(@Body() createRolDto: CreateRolDto) {
    const rol = await this.rolService.create(createRolDto);
    return {
      success: true,
      data: rol,
      message: 'Rol creado con exito',
    };
  }

  @Get()
  @ApiOperation({ summary: 'Devuelve todos los roles habilitados' })
  @ApiResponse({ status: 200, description: 'Retorna todas los roles habilitados con exito' })
  async findAll() {
    const colRoles = await this.rolService.findAll();
    return {
      success: true,
      data: colRoles,
      message: 'Roles obtenidos con exito',
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Devuelve el rol buscado' })
  @ApiResponse({ status: 200, description: 'Retorna el rol buscado con exito' })
  @ApiResponse({ status: 404, description: 'Rol no encontrado' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const rol = await this.rolService.findOne(id);
    return {
      success: true,
      data: rol,
      message: 'Rol obtenido con exito',
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualiza los datos de un rol' })
  @ApiResponse({ status: 200, description: 'Rol actualizado con exito' })
  @ApiResponse({ status: 400, description: 'No se enviaron cambios' })
  @ApiResponse({ status: 404, description: 'Rol no encontrado' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateRolDto: UpdateRolDto) {
    const rolModificado = await this.rolService.update(id, updateRolDto);
    return {
      success: true,
      data: rolModificado,
      message: 'Rol modificado con exito',
    };
  }

  @Delete('eliminar/:id')
  @ApiOperation({ summary: 'Borrado logico de un rol' })
  @ApiResponse({ status: 200, description: 'Rol borrado logicamente con exito' })
  @ApiResponse({ status: 400, description: 'El rol ya esta deshabilitado' })
  @ApiResponse({ status: 404, description: 'Rol no encontrado' })
  async borradoLogico(@Param('id', ParseIntPipe) id: number) {
    const rolBorradoLogico = await this.rolService.borradoLogico(id);
    return {
      success: true,
      data: rolBorradoLogico,
      message: 'Rol borrado logicamente con exito',
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
}
