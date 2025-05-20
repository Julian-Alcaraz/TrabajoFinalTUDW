import { Controller, Get, UseGuards } from '@nestjs/common';
import { CategoriaService } from './categoria.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('categoria')
@UseGuards(JwtAuthGuard)
@ApiTags('categoria')
export class CategoriaController {
  constructor(private readonly categoriaService: CategoriaService) {}
  /*
  @Post()
  create(@Body() createCategoriaDto: CreateCategoriaDto) {
    return this.categoriaService.create(createCategoriaDto);
  }
  */
  @Get()
  @ApiOperation({ summary: 'Devuelve todas las categorias' })
  @ApiResponse({ status: 200, description: 'Retorna todos las categorias con exito' })
  async findAll() {
    const categorias = await this.categoriaService.findAll();
    return {
      success: true,
      data: categorias,
      message: 'Categorias encontradas con exito',
    };
  }

  /*
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoriaDto: UpdateCategoriaDto) {
    return this.categoriaService.update(+id, updateCategoriaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriaService.remove(+id);
  }
  */
}
