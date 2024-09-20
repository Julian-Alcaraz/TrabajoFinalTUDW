import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { MenuRolService } from './menu-rol.service';
import { CreateMenuRolDto } from './dto/create-menu-rol.dto';

@Controller('menu-rol')
@ApiTags('menu-rol')
export class MenuRolController {
  constructor(private readonly menuRolService: MenuRolService) {}

  @Post()
  @ApiOperation({ summary: 'Crea un nuevo menu-rol' })
  @ApiResponse({ status: 201, description: 'Menu-rol creado con exito' })
  async create(@Body() createMenuRolDto: CreateMenuRolDto) {
    const menuRol = await this.menuRolService.create(createMenuRolDto);
    return {
      success: menuRol ? true : false,
      data: menuRol,
      message: menuRol ? 'Rol creado con exito' : 'Error',
    };
  }

  @Get()
  @ApiOperation({ summary: 'Devuelve todos los menu-rol habilitados' })
  @ApiResponse({ status: 200, description: 'Retorna todas los menu-rol habilitados con exito' })
  @ApiResponse({ status: 403, description: 'No permitido' })
  findAll() {
    return this.menuRolService.findAll();
  }

  @Get(':idMenu/:idRol')
  @ApiOperation({ summary: 'Devuelve el menu-rol buscado' })
  @ApiResponse({ status: 200, description: 'Retorna el menu-rol buscado con exito' })
  @ApiResponse({ status: 404, description: 'Menu-rol no encontrado' })
  async findOne(@Param('idMenu', ParseIntPipe) idMenu: number, @Param('idRol', ParseIntPipe) idRol: number) {
    return this.menuRolService.findOne(idMenu, idRol);
  }

  /*
  @Patch(':id')
  @ApiOperation({ summary: 'Actualiza los datos de un menu-rol' })
  @ApiResponse({ status: 200, description: 'Menu-rol actualizado con exito' })
  @ApiResponse({ status: 404, description: 'Menu-rol no encontrado' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateMenuRolDto: UpdateMenuRolDto) {
    return this.menuRolService.update(id, updateMenuRolDto);
  }
  */

  @Delete(':idMenu/:idRol/')
  @ApiOperation({ summary: 'Borra un menu-rol' })
  @ApiResponse({ status: 200, description: 'Menu-rol borrado con exito' })
  @ApiResponse({ status: 404, description: 'Menu-rol no encontrado' })
  async remove(@Param('idMenu', ParseIntPipe) idMenu: number, @Param('idRol', ParseIntPipe) idRol: number) {
    return this.menuRolService.remove(idMenu, idRol);
  }

  /*
  @Patch(':idMenu/:idRol/eliminar')
  @ApiOperation({ summary: 'Borrado logico de un menu-rol' })
  @ApiResponse({ status: 200, description: 'Menu-rol borrado logicamente con exito' })
  @ApiResponse({ status: 404, description: 'Menu-rol no encontrado' })
  async borradoLogico(@Param('idMenu', ParseIntPipe) idMenu: number, @Param('idRol', ParseIntPipe) idRol: number) {
    return this.menuRolService.borradoLogico(idMenu, idRol);
  }
  */
}
