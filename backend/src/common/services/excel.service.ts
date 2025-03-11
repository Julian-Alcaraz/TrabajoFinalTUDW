import { BadRequestException, Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';

@Injectable()
export class ExcelService {
  /**
   * recibe un archivo, verifica que sea un excel y devuelve un json con los datos
   * @param file
   * @returns array json
   *
   */
  leerArchivoExcel(file: Express.Multer.File): any[] {
    const validMimeTypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    if (!validMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('El archivo debe ser de tipo Excel (.xls o .xlsx)');
    }
    const workbook = XLSX.read(file.buffer, { type: 'buffer', cellDates: true });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: null, dateNF: 'yyyy-mm-dd' });
    return jsonData;
  }
}
