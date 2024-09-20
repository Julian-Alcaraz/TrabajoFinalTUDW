import { Controller, Get, Post, Body, Patch, Param, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

@Controller('menu')
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
      success: menu ? true : false,
      data: menu,
      message: menu ? 'Menu creado con exito' : 'Error',
    };
  }

  @Get()
  @ApiOperation({ summary: 'Devuelve todos los menus habilitados' })
  @ApiResponse({ status: 200, description: 'Retorna todos los menus habilitados con exito' })
  async findAll() {
    const colMenus = await this.menuService.findAll();
    return {
      success: colMenus ? true : false,
      data: colMenus,
      message: colMenus ? 'Menus obtenidos con exito' : 'Error',
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Devuelve el menu buscado' })
  @ApiResponse({ status: 200, description: 'Retorna el menu buscado con exito' })
  @ApiResponse({ status: 404, description: 'Menu no encontrado' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const menu = await this.menuService.findOne(id);
    return {
      success: menu ? true : false,
      data: menu,
      message: menu ? 'Menu obtenido con exito' : 'Error',
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
      success: menuModificado ? true : false,
      data: menuModificado,
      message: menuModificado ? 'Menu modificado con exito' : 'Error',
    };
  }

  @Patch('eliminar/:id')
  @ApiOperation({ summary: 'Borrado logico de un menu' })
  @ApiResponse({ status: 200, description: 'Menu borrado logicamente con exito' })
  @ApiResponse({ status: 404, description: 'Menu no encontrado' })
  async borradoLogico(@Param('id', ParseIntPipe) id: number) {
    const menuBorradoLogico = await this.menuService.borradoLogico(id);
    return {
      success: menuBorradoLogico ? true : false,
      data: menuBorradoLogico,
      message: menuBorradoLogico ? 'Menu borrado logicamente con exito' : 'Error',
    };
  }

  @Get('menusUsuario/:id')
  @ApiOperation({ summary: 'Devuelve todos los menus segun el id de un usuario' })
  @ApiResponse({ status: 200, description: 'Menus devueltos con exito' })
  async menusUsuario(@Param('id', ParseIntPipe) id: number) {
    const menusDelUsuario = await this.menuService.menusUsuario(id);
    return {
      success: menusDelUsuario ? true : false,
      data: menusDelUsuario,
      message: menusDelUsuario ? 'Menus del usuario retornados con exito' : 'Error',
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
