import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
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
  async create(@Body() createMenuDto: CreateMenuDto) {
    return this.menuService.create(createMenuDto);
  }

  @Get()
  @ApiOperation({ summary: 'Devuelve todos los menus habilitados' })
  @ApiResponse({ status: 200, description: 'Retorna todos los menus habilitados con exito' })
  @ApiResponse({ status: 403, description: 'No permitido' })
  findAll() {
    return this.menuService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Devuelve el menu buscado' })
  @ApiResponse({ status: 200, description: 'Retorna el menu buscado con exito' })
  @ApiResponse({ status: 404, description: 'Menu no encontrado' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.menuService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualiza los datos de un menu' })
  @ApiResponse({ status: 200, description: 'Menu actualizado con exito' })
  @ApiResponse({ status: 404, description: 'Menu no encontrado' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.update(id, updateMenuDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Borra un menu' })
  @ApiResponse({ status: 200, description: 'Menu borrado con exito' })
  @ApiResponse({ status: 404, description: 'Menu no encontrado' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.menuService.remove(id);
  }

  @Patch(':id/eliminar')
  @ApiOperation({ summary: 'Borrado logico de un menu' })
  @ApiResponse({ status: 200, description: 'Menu borrado logicamente con exito' })
  @ApiResponse({ status: 404, description: 'Menu no encontrado' })
  async borradoLogico(@Param('id', ParseIntPipe) id: number) {
    return this.menuService.borradoLogico(id);
  }
}
