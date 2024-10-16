import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { InstitucionService } from './institucion.service';
import { CreateInstitucionDto } from './dto/create-institucion.dto';
import { UpdateInstitucionDto } from './dto/update-institucion.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { ApiTags } from '@nestjs/swagger';

@Controller('institucion')
@UseGuards(JwtAuthGuard)
@ApiTags('institucion')
export class InstitucionController {
  constructor(private readonly institucionService: InstitucionService) {}

  @Post()
  create(@Body() createInstitucionDto: CreateInstitucionDto) {
    return this.institucionService.create(createInstitucionDto);
  }

  @Get()
  findAll() {
    return this.institucionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.institucionService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateInstitucionDto: UpdateInstitucionDto) {
    return this.institucionService.update(id, updateInstitucionDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.institucionService.remove(id);
  }
}
