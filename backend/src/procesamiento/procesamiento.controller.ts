import { Controller, Post, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ProcesamientoService } from './procesamiento.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExcelService } from 'src/common/services/excel.service';

@Controller('procesamiento')
export class ProcesamientoController {
  constructor(
    private readonly procesamientoService: ProcesamientoService,
    private readonly excelService: ExcelService,
  ) {}

  @Post('clinica')
  @UseInterceptors(FileInterceptor('archivo')) // nombre del campo del archivo en el append
  async procesarClinica(@Body() body: any, @UploadedFile() file: Express.Multer.File) {
    const data = this.excelService.leerArchivoExcel(file);
    const noCargados = await this.procesamientoService.procesarClinica(data);
    return { succes: true, data: noCargados, message: 'clinic' };
  }

  @Post('odontologia')
  @UseInterceptors(FileInterceptor('archivo')) // nombre del campo del archivo en el append
  async procesarOdontologia(@Body() body: any, @UploadedFile() file: Express.Multer.File) {
    const data = this.excelService.leerArchivoExcel(file);
    await this.procesamientoService.procesarOdontologia(data);
    console.log(body, file);
    return { succes: true, message: 'odon' };
  }

  @Post('oftalmologia')
  @UseInterceptors(FileInterceptor('archivo')) // nombre del campo del archivo en el append
  async procesarOftalmologia(@Body() body: any, @UploadedFile() file: Express.Multer.File) {
    const data = this.excelService.leerArchivoExcel(file);
    await this.procesamientoService.procesarOftalmologia(data);
    // console.log(body, file);
    return { succes: true, message: 'ofta' };
  }

  @Post('fonoaudiologia')
  @UseInterceptors(FileInterceptor('archivo')) // nombre del campo del archivo en el append
  async procesarFonoaudiologia(@Body() body: any, @UploadedFile() file: Express.Multer.File) {
    const data = this.excelService.leerArchivoExcel(file);
    await this.procesamientoService.procesarFonoaudiologia(data);
    console.log(body, file);
    return { succes: true, message: 'fono' };
  }
}
