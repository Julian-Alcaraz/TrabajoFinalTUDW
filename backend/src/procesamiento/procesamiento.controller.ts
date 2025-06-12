import { Controller, Post, Body, UseInterceptors, UploadedFile, UseGuards, Req, Res, Get } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StreamableFile } from '@nestjs/common';
import type { Response } from 'express';
import * as path from 'path';

import { ExcelService } from 'src/common/services/excel.service';
import { ArchivoService } from 'src/common/services/archivo.service';
import { ProcesamientoService } from './procesamiento.service';
import { ExportService } from './export.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { SecretService } from 'src/common/services/secret.service';
import { createReadStream } from 'fs';

@Controller('procesamiento')
@UseGuards(JwtAuthGuard)
export class ProcesamientoController {
  constructor(
    private readonly procesamientoService: ProcesamientoService,
    private readonly excelService: ExcelService,
    private readonly exportService: ExportService,
    private readonly archivoService: ArchivoService,
    private readonly secretService: SecretService,
  ) {}

  // ============ IMPORTS ============

  @Post('clinica')
  @UseInterceptors(FileInterceptor('archivo')) // nombre del campo del archivo en el append
  async procesarClinica(@Body() body: any, @UploadedFile() file: Express.Multer.File, @Req() req: any) {
    const procesamiento = this.secretService.readSecret('PROCESAMIENTO') === 'true';
    if (procesamiento) {
      const data = await this.excelService.leerArchivoExcel(file);
      const noCargados = await this.procesamientoService.procesarClinica(data, req.user);
      return { success: true, data: noCargados, message: 'clinic' };
    } else {
      return { success: false, message: 'Opcion deshabilitada' };
    }
  }

  @Post('odontologia')
  @UseInterceptors(FileInterceptor('archivo')) // nombre del campo del archivo en el append
  async procesarOdontologia(@Body() body: any, @UploadedFile() file: Express.Multer.File, @Req() req: any) {
    const procesamiento = this.secretService.readSecret('PROCESAMIENTO') === 'true';
    if (procesamiento) {
      const data = await this.excelService.leerArchivoExcel(file);
      const noCargados = await this.procesamientoService.procesarOdontologia(data, req.user);
      return { success: true, data: noCargados, message: 'odon' };
    } else {
      return { success: false, message: 'Opcion deshabilitada' };
    }
  }

  @Post('oftalmologia')
  @UseInterceptors(FileInterceptor('archivo')) // nombre del campo del archivo en el append
  async procesarOftalmologia(@Body() body: any, @UploadedFile() file: Express.Multer.File, @Req() req: any) {
    const procesamiento = this.secretService.readSecret('PROCESAMIENTO') === 'true';
    if (procesamiento) {
      const data = await this.excelService.leerArchivoExcel(file);
      const noCargados = await this.procesamientoService.procesarOftalmologia(data, req.user);
      return { success: true, data: noCargados, message: 'ofta' };
    } else {
      return { success: false, message: 'Opcion deshabilitada' };
    }
  }

  @Post('fonoaudiologia')
  @UseInterceptors(FileInterceptor('archivo')) // nombre del campo del archivo en el append
  async procesarFonoaudiologia(@Body() body: any, @UploadedFile() file: Express.Multer.File, @Req() req: any) {
    const procesamiento = this.secretService.readSecret('PROCESAMIENTO') === 'true';
    if (procesamiento) {
      const data = await this.excelService.leerArchivoExcel(file);
      const noCargados = await this.procesamientoService.procesarFonoaudiologia(data, req.user);
      return { success: true, data: noCargados, message: 'fono' };
    } else {
      return { success: false, message: 'Opcion deshabilitada' };
    }
  }

  @Post('prevencion')
  @UseInterceptors(FileInterceptor('archivo')) // nombre del campo del archivo en el append
  async procesarPrevencion(@Body() body: any, @UploadedFile() file: Express.Multer.File, @Req() req: any) {
    const procesamiento = this.secretService.readSecret('PROCESAMIENTO') === 'true';
    if (procesamiento) {
      const data = await this.excelService.leerArchivoExcel(file);
      const noCargados = await this.procesamientoService.procesarPrevencion(data, req.user);
      return { success: true, data: noCargados, message: 'preve' };
    } else {
      return { success: false, message: 'Opcion deshabilitada' };
    }
  }

  @Post('social')
  @UseInterceptors(FileInterceptor('archivo')) // nombre del campo del archivo en el append
  async procesarSocial(@Body() body: any, @UploadedFile() file: Express.Multer.File, @Req() req: any) {
    const procesamiento = this.secretService.readSecret('PROCESAMIENTO') === 'true';
    if (procesamiento) {
      const data = await this.excelService.leerArchivoExcel(file);
      const noCargados = await this.procesamientoService.procesarSocial(data, req.user);
      return { success: true, data: noCargados, message: 'soc' };
    } else {
      return { success: false, message: 'Opcion deshabilitada' };
    }
  }

  @Post('talleres')
  @UseInterceptors(FileInterceptor('archivo')) // nombre del campo del archivo en el append
  async procesarTalleres(@Body() body: any, @UploadedFile() file: Express.Multer.File, @Req() req: any) {
    const procesamiento = this.secretService.readSecret('PROCESAMIENTO') === 'true';
    if (procesamiento) {
      console.log(body.tipoTaller)
      const data = await this.excelService.leerArchivoExcel(file);
      const noCargados = await this.procesamientoService.procesarTalleres(data, req.user, body.tipoTaller);
      return { success: true, data: noCargados, message: 'tall' };
    } else {
      return { success: false, message: 'Opcion deshabilitada' };
    }
  }
  // ============ EXPORTS ============

  @Post('export/consultas')
  async exportarConsultas(@Body() consulta: any, @Res({ passthrough: true }) res: Response): Promise<StreamableFile> {
    const datosConsultas = await this.exportService.exportarConsultas(consulta);
    const { nombreArchivo, buffer } = await this.excelService.generarExcelConsultas(datosConsultas);
    const { success, stream } = this.archivoService.crearStream(buffer);
    if (success) {
      res.set({
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${path.basename(nombreArchivo)}"`,
        'Access-Control-Expose-Headers': 'Content-Disposition',
      });
      return new StreamableFile(stream);
    }
  }

  @Post('export/chicos')
  async exportarChicos(@Body() consulta: any, @Res({ passthrough: true }) res: Response): Promise<StreamableFile> {
    const datosChicos = await this.exportService.exportarChicos(consulta);
    const { nombreArchivo, buffer } = await this.excelService.generarExcelChicos(datosChicos);
    const { success, stream } = this.archivoService.crearStream(buffer);
    if (success) {
      res.set({
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${path.basename(nombreArchivo)}"`,
        'Access-Control-Expose-Headers': 'Content-Disposition',
      });
      return new StreamableFile(stream);
    }
  }

  @Post('export/talleres')
  async exportarTalleres(@Body() consulta: any, @Res({ passthrough: true }) res: Response): Promise<StreamableFile> {
    const datosTalleres = await this.exportService.exportarTalleres(consulta);
    const { nombreArchivo, buffer } = await this.excelService.generarExcelTalleres(datosTalleres);
    // console.log(Object.keys(datosTalleres).length);
    const { success, stream } = this.archivoService.crearStream(buffer);
    if (success) {
      res.set({
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${path.basename(nombreArchivo)}"`,
        'Access-Control-Expose-Headers': 'Content-Disposition',
      });
      return new StreamableFile(stream);
    }
  }
  @Get('downloadManual')
  async downloadManual(@Res() res): Promise<void> {
    const filePath = path.join(__dirname, '..', '..', 'public', 'files', 'manual.pdf'); // Ruta del archivo estático
    const stream = createReadStream(filePath);
    console.log(stream);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="Manual_Usuarios_SolPatagonia.pdf"`,
      'Access-Control-Expose-Headers': 'Content-Disposition',
    });
    stream.pipe(res);
  }
}
