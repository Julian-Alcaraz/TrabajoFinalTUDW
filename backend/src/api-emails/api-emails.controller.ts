import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiEmailsService } from './api-emails.service';
import { CreateApiEmailDto } from './dto/create-api-email.dto';
import { UpdateApiEmailDto } from './dto/update-api-email.dto';

@Controller('api-emails')
export class ApiEmailsController {
  constructor(private readonly apiEmailsService: ApiEmailsService) {}

  @Get(':email')
  async validarEmail(@Param('email') email: string) {
    const response = await this.apiEmailsService.validarEmail(email);
    return {
      success: true,
      data: response,
      message: 'Email validado con exito',
    };
  }

  /*
  @Post()
  create(@Body() createApiEmailDto: CreateApiEmailDto) {
    return this.apiEmailsService.create(createApiEmailDto);
  }

  @Get()
  findAll() {
    return this.apiEmailsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.apiEmailsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateApiEmailDto: UpdateApiEmailDto) {
    return this.apiEmailsService.update(+id, updateApiEmailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.apiEmailsService.remove(+id);
  }
    */
}
