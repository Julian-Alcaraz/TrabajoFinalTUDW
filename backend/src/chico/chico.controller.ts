import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChicoService } from './chico.service';
import { CreateChicoDto } from './dto/create-chico.dto';
import { UpdateChicoDto } from './dto/update-chico.dto';

@Controller('chico')
export class ChicoController {
  constructor(private readonly chicoService: ChicoService) {}

  @Post()
  create(@Body() createChicoDto: CreateChicoDto) {
    return this.chicoService.create(createChicoDto);
  }

  @Get()
  findAll() {
    return this.chicoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chicoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChicoDto: UpdateChicoDto) {
    return this.chicoService.update(+id, updateChicoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chicoService.remove(+id);
  }
}
