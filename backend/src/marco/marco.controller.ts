import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MarcoService } from './marco.service';
import { CreateMarcoDto } from './dto/create-marco.dto';
import { UpdateMarcoDto } from './dto/update-marco.dto';

@Controller('marco')
export class MarcoController {
  constructor(private readonly marcoService: MarcoService) {}

  @Post()
  create(@Body() createMarcoDto: CreateMarcoDto) {
    return this.marcoService.create(createMarcoDto);
  }

  @Get()
  findAll() {
    return this.marcoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.marcoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMarcoDto: UpdateMarcoDto) {
    return this.marcoService.update(+id, updateMarcoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.marcoService.remove(+id);
  }
}
