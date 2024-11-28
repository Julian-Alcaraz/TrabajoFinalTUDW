import { Controller, Get, Post, Body, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { CsvService } from './csv.service';
import * as path from 'path';

@Controller('csv')
export class CsvController {
  constructor(private readonly csvService: CsvService) {}

  @Post()
  async create(@Body() consultaPersonalizada: any) {
    const directorioArchivo = await this.csvService.generarCsv(consultaPersonalizada);
    return {
      success: true,
      data: path.basename(directorioArchivo),
      messsage: 'CSV creado con éxito',
    };
  }

  @Get(':nombreArchivo')
  download(@Param('nombreArchivo') nombreArchivo: string, @Res() res: Response) {
    this.csvService.descargarCsv(nombreArchivo, res);
  }
}
