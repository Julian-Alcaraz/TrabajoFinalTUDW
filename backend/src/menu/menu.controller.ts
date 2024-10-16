import { Controller, Get, Post, Body, Patch, Param, ParseIntPipe, Delete, Put, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('menu')
@UseGuards(JwtAuthGuard)
@ApiTags('menus')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  @ApiOperation({ summary: 'Crea un nuevo menu' })
  @ApiResponse({ status: 201, description: 'Menu creado con exito' })
  @ApiResponse({ status: 404, description: 'Padre del menu no encontrado' })
  async create(@Body() createMenuDto: CreateMenuDto) {
    const menu = await this.menuService.create(createMenuDto);
    return {
      success: true,
      data: menu,
      message: 'Menu creado con exito',
    };
  }

  @Get()
  @ApiOperation({ summary: 'Devuelve todos los menus habilitados' })
  @ApiResponse({ status: 200, description: 'Retorna todos los menus habilitados con exito' })
  async findAll() {
    const colMenus = await this.menuService.findAll();
    return {
      success: true,
      data: colMenus,
      message: 'Menus obtenidos con exito',
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Devuelve el menu buscado' })
  @ApiResponse({ status: 200, description: 'Retorna el menu buscado con exito' })
  @ApiResponse({ status: 404, description: 'Menu no encontrado' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const menu = await this.menuService.findOne(id);
    return {
      success: true,
      data: menu,
      message: 'Menu obtenido con exito',
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualiza los datos de un menu' })
  @ApiResponse({ status: 200, description: 'Menu modificado con exito' })
  @ApiResponse({ status: 404, description: 'Menu no encontrado' })
  @ApiResponse({ status: 400, description: 'No se enviaron cambios' })
  @ApiResponse({ status: 400, description: 'Un menu no puede ser su propio padre' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateMenuDto: UpdateMenuDto) {
    const menuModificado = await this.menuService.update(id, updateMenuDto);
    return {
      success: true,
      data: menuModificado,
      message: 'Menu modificado con exito',
    };
  }

  @Delete('eliminar/:id')
  @ApiOperation({ summary: 'Borrado logico de un menu' })
  @ApiResponse({ status: 200, description: 'Menu borrado logicamente con exito' })
  @ApiResponse({ status: 404, description: 'Menu no encontrado' })
  async borradoLogico(@Param('id', ParseIntPipe) id: number) {
    const menuBorradoLogico = await this.menuService.borradoLogico(id);
    return {
      success: true,
      data: menuBorradoLogico,
      message: 'Menu borrado logicamente con exito',
    };
  }

  @Delete(':idMenu/rol/:idRol')
  @ApiOperation({ summary: 'Borrado de un rol relacionado al menu' })
  @ApiResponse({ status: 200, description: 'Rol relacionado al menu borrado con exito' })
  @ApiResponse({ status: 404, description: 'Menu no encontrado' })
  @ApiResponse({ status: 404, description: 'El rol no esta asignado al menu' })
  @ApiResponse({ status: 400, description: 'Un menu no puede quedarse sin roles' })
  async eliminarRolDeMenu(@Param('idMenu', ParseIntPipe) idMenu: number, @Param('idRol', ParseIntPipe) idRol: number) {
    const resultado = await this.menuService.eliminarRolDeMenu(idMenu, idRol);
    return {
      success: true,
      data: resultado,
      message: 'Rol del menu borrado con exito',
    };
  }

  @Put(':idMenu/rol/:idRol')
  @ApiOperation({ summary: 'Agregar un rol relacionado al menu' })
  @ApiResponse({ status: 404, description: 'Menu no encontrado' })
  @ApiResponse({ status: 404, description: 'Rol no encontrado' })
  @ApiResponse({ status: 400, description: 'El menu ya tiene ese rol' })
  async agregarRolDeMenu(@Param('idMenu', ParseIntPipe) idMenu: number, @Param('idRol', ParseIntPipe) idRol: number) {
    const resultado = await this.menuService.agregarRolDeMenu(idMenu, idRol);
    return {
      success: true,
      data: resultado,
      message: 'Rol del menu asignado con exito',
    };
  }

  /*
  @Delete(':id')
  @ApiOperation({ summary: 'Borra un menu' })
  @ApiResponse({ status: 200, description: 'Menu borrado con exito' })
  @ApiResponse({ status: 404, description: 'Menu no encontrado' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.menuService.remove(id);
  }
  */
}
