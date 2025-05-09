import { Controller, Post, Body, UseInterceptors, UploadedFile, UseGuards, Req, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StreamableFile } from '@nestjs/common';
import type { Response } from 'express';
import * as path from 'path';

import { ExcelService } from 'src/common/services/excel.service';
import { ArchivoService } from 'src/common/services/archivo.service';
import { ProcesamientoService } from './procesamiento.service';
import { ExportService } from './export.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('procesamiento')
@UseGuards(JwtAuthGuard)
export class ProcesamientoController {
  constructor(
    private readonly procesamientoService: ProcesamientoService,
    private readonly excelService: ExcelService,
    private readonly exportService: ExportService,
    private readonly archivoService: ArchivoService,
  ) {}

  // ============ IMPORTS ============

  @Post('clinica')
  @UseInterceptors(FileInterceptor('archivo')) // nombre del campo del archivo en el append
  async procesarClinica(@Body() body: any, @UploadedFile() file: Express.Multer.File, @Req() req: any) {
    const data = this.excelService.leerArchivoExcel(file);
    const noCargados = await this.procesamientoService.procesarClinica(data, req.user);
    return { succes: true, data: noCargados, message: 'clinic' };
  }

  @Post('odontologia')
  @UseInterceptors(FileInterceptor('archivo')) // nombre del campo del archivo en el append
  async procesarOdontologia(@Body() body: any, @UploadedFile() file: Express.Multer.File, @Req() req: any) {
    const data = this.excelService.leerArchivoExcel(file);
    const noCargados = await this.procesamientoService.procesarOdontologia(data, req.user);
    return { succes: true, data: noCargados, message: 'odon' };
  }

  @Post('oftalmologia')
  @UseInterceptors(FileInterceptor('archivo')) // nombre del campo del archivo en el append
  async procesarOftalmologia(@Body() body: any, @UploadedFile() file: Express.Multer.File, @Req() req: any) {
    const data = this.excelService.leerArchivoExcel(file);
    const noCargados = await this.procesamientoService.procesarOftalmologia(data, req.user);
    return { succes: true, data: noCargados, message: 'ofta' };
  }

  @Post('fonoaudiologia')
  @UseInterceptors(FileInterceptor('archivo')) // nombre del campo del archivo en el append
  async procesarFonoaudiologia(@Body() body: any, @UploadedFile() file: Express.Multer.File, @Req() req: any) {
    const data = this.excelService.leerArchivoExcel(file);
    const noCargados = await this.procesamientoService.procesarFonoaudiologia(data, req.user);
    return { succes: true, data: noCargados, message: 'fono' };
  }

  @Post('prevencion')
  @UseInterceptors(FileInterceptor('archivo')) // nombre del campo del archivo en el append
  async procesarPrevencion(@Body() body: any, @UploadedFile() file: Express.Multer.File, @Req() req: any) {
    const data = this.excelService.leerArchivoExcel(file);
    const noCargados = await this.procesamientoService.procesarPrevencion(data, req.user);
    return { succes: true, data: noCargados, message: 'fono' };
  }

  @Post('social')
  @UseInterceptors(FileInterceptor('archivo')) // nombre del campo del archivo en el append
  async procesarSocial(@Body() body: any, @UploadedFile() file: Express.Multer.File, @Req() req: any) {
    const data = this.excelService.leerArchivoExcel(file);
    const noCargados = await this.procesamientoService.procesarSocial(data, req.user);
    return { succes: true, data: noCargados, message: 'fono' };
  }

  // ============ EXPORTS ============

  @Post('export/consultas')
  async exportarConsultas(@Body() consulta: any, @Res({ passthrough: true }) res: Response): Promise<StreamableFile> {
    const datosConsultas = await this.exportService.exportarConsultas(consulta);
    const { nombreArchivo, buffer } = await this.excelService.generarExcelConsultas(datosConsultas);
    const { success, archivo } = this.archivoService.guardarArchivo(nombreArchivo, 'consultas', buffer);
    if (success) {
      res.set({
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${path.basename(nombreArchivo)}"`,
        'Access-Control-Expose-Headers': 'Content-Disposition',
      });
      return new StreamableFile(archivo);
    }
  }
}
