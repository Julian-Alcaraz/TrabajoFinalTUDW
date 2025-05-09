import { BadRequestException, Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import * as XLSX from 'xlsx';
import { PassThrough, Readable } from 'stream';
import { DateTime } from 'luxon';

@Injectable()
export class ExcelService {
  /**
   * recibe un archivo, verifica que sea un excel y devuelve un json con los datos
   * @param file
   * @returns array json
   *
   */

  //
  async leerArchivoExcel(file: Express.Multer.File): Promise<any[]> {
    const validMimeTypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    if (!validMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('El archivo debe ser de tipo Excel (.xls o .xlsx)');
    }

    const workbook = XLSX.read(file.buffer, { type: 'buffer', cellDates: true });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: null, dateNF: 'yyyy-mm-dd' });
    return jsonData;
    /*

    const stream = Readable.from(file.buffer); // Convertimos el buffer a stream
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.read(stream); // Leemos desde el stream

    const worksheet = workbook.worksheets[0];
    const jsonData: any[] = [];

    // Extraemos encabezados desde la primera fila
    const headers: string[] = [];
    worksheet.getRow(1).eachCell({ includeEmpty: true }, (cell, colNumber) => {
      headers.push(cell.text?.trim() ?? `col${colNumber}`);
    });

    // Recorremos las filas restantes y construimos objetos
    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber === 1) return; // Saltamos encabezados
      const rowData: Record<string, any> = {};

      // Luego en tu loop:
      row.eachCell({ includeEmpty: false }, (cell, colNumber) => {
        rowData[headers[colNumber - 1]] = this.getCellValue(cell);
      });

      jsonData.push(rowData);
    });
    console.log(jsonData);
    */
  }

  getCellValue(cell: ExcelJS.Cell): any {
    if (cell.type === ExcelJS.ValueType.Formula) {
      return cell.result ?? null;
    }
    return cell.value ?? null;
  }

  private consultasClinica: any[] = [];
  private consultasFonoaudiologia: any[] = [];
  private consultasOftalmologia: any[] = [];
  private consultasOdontologia: any[] = [];
  private consultasPrevencion: any[] = [];
  private consultasSocial: any[] = [];

  // ============= CHICOS =============

  async generarExcelChicos(chicos: any) {
    try {
      const datosChicos = this.prepararDataChicos(chicos);
      const encabezados = ['NOMBRE Y APELLIDO', 'EDAD', 'DNI', 'FECHA NAC.', 'SEXO', 'DIRECCIÓN', 'LOCALIDAD', 'BARRIO', 'TELÉFONO', 'NOMBRE PADRE', 'NOMBRE MADRE'];
      const workbook = new ExcelJS.Workbook();
      const worksheetChicos = workbook.addWorksheet('Chicos');

      worksheetChicos.addRow(encabezados);
      datosChicos.forEach((chico) => {
        worksheetChicos.addRow(Object.values(chico));
      });

      // Estilos
      this.aplicarEstilosChicos(worksheetChicos);

      const buffer = await workbook.xlsx.writeBuffer();

      const nombreArchivo = nombrarArchivo('Chicos');

      // Retorno nombre y buffer
      return { success: true, nombreArchivo, buffer };
    } catch (err) {
      console.error('Error al generar el Excel:', err);
      return { success: false, err };
    }
  }

  prepararDataChicos(chicos: any[]) {
    const arrayChicos = [];
    Object.values(chicos).forEach((chico) => {
      const { id, updated_at, created_at, deshabilitado, dni, nombre, apellido, sexo, fe_nacimiento, direccion, telefono, nombre_madre, nombre_padre, barrio } = chico;
      const fechaNacimientoDate = new Date(chico.fe_nacimiento);
      const fechaNacimiento = DateTime.fromISO(fechaNacimientoDate.toISOString(), { zone: 'utc' }).toFormat('dd-MM-yyyy');
      const edad = calcularEdad(fe_nacimiento, new Date());
      const datosChico = {
        nombreYApellido: nombre + ' ' + apellido,
        edad: edad,
        dni: dni,
        fechaNac: fechaNacimiento,
        sexo: sexo,
        direccion: direccion,
        localidad: barrio.localidad.nombre,
        barrio: barrio.nombre,
        telefono: existeItem(telefono) ? '-' : chico.telefono,
        nombrePadre: nombre_padre ? nombre_padre : '-',
        nombreMadre: nombre_madre ? nombre_madre : '-',
      };
      arrayChicos.push(datosChico);
    });
    return arrayChicos;
  }

  aplicarEstilosChicos(worksheet) {
    const celdasARotar = [];
    const celdasChicas = [];
    const filaCabecera = worksheet.getRow(1);
    filaCabecera.height = 150;
    filaCabecera.eachCell((cell: any) => {
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      this.procesarCeldaSegunHoja(worksheet, cell, celdasARotar, celdasChicas);
    });
  }

  // ============= CONSULTAS =============

  async generarExcelConsultas(consultas: any) {
    try {
      this.consultasClinica = [];
      this.consultasFonoaudiologia = [];
      this.consultasOftalmologia = [];
      this.consultasOdontologia = [];
      this.consultasPrevencion = [];
      this.consultasSocial = [];

      this.prepararConsultas(consultas);
      const encabezadosComunes = ['NOMBRE Y APELLIDO', 'DNI', 'FECHA', 'FECHA NAC.', 'SEXO', 'OBRA SOCIAL', 'DIRECCIÓN', 'BARRIO', 'TELÉFONO', 'NOMBRE PADRE', 'NOMBRE MADRE', 'EDAD', 'INSTITUCIÓN', 'SALA/GRADO', 'TURNO', 'PROFESIONAL'];
      const workbook = new ExcelJS.Workbook();
      // Clinica
      if (this.consultasClinica.length !== 0) {
        const worksheetClinica = workbook.addWorksheet('Clinica');
        // Encabezados
        worksheetClinica.addRow([]);
        worksheetClinica.addRow(encabezadosComunes.concat('ES CLINICA', 'ODONTOLOGÍA', 'FONOAUDIOLOGÍA', 'OFTALMOLOGÍA', 'LECHE', 'SEGTO', 'TA', 'PCTA', 'TAS', 'TAD', 'ESTADO NUTRICIONAL', 'PCIMC', 'IMC', 'CC (cm)', 'PCT (T/E)', 'TALLA (cm)', 'PESO (kg)', 'CP-BQ', 'CP-D', 'O', 'CP-OH', 'HTA', 'DBT', 'HIDRATACIÓN', 'SUEÑO', 'JUEGO AL AIRE LIBRE', 'PANTALLA', 'Nº COMIDAS AL DÍA', 'INFUSIONES', 'ALIMENTACIÓN', 'LENGUAJE', 'O Y T', 'EX. VISUAL', 'VACUNAS', 'ENF. PREVIAS', 'ANT. PERINATALES', 'OBSERVACIONES'));
        // Datos
        this.consultasClinica.forEach((consulta) => {
          worksheetClinica.addRow(Object.values(consulta));
        });
      }
      // Odontologia
      if (this.consultasOdontologia.length !== 0) {
        const worksheetOdontologia = workbook.addWorksheet('Odontologia');
        // Encabezados
        worksheetOdontologia.addRow([]);
        worksheetOdontologia.addRow(encabezadosComunes.concat('DER. EXTERNA', 'PRIMERA VEZ', 'ULTERIOR', 'TOTAL PERMANENTES', 'TOTAL TEMPORARIOS', 'SELLADOR', 'TOPIFICACIÓN', 'ENS. CEPILLADO', 'DIENTE RECUPERABLE', 'DIENTES NO RECUPERABLE', 'CEPILLO', 'CLASIFICACIÓN', 'HÁBITOS', 'OBSERVACIONES'));
        // Datos
        this.consultasOdontologia.forEach((consulta) => {
          worksheetOdontologia.addRow(Object.values(consulta));
        });
      }
      // Fonoaudiologia
      if (this.consultasFonoaudiologia.length !== 0) {
        const worksheetFonoaudiologia = workbook.addWorksheet('Fonoaudiologia');
        // Encabezados
        worksheetFonoaudiologia.addRow([]);
        worksheetFonoaudiologia.addRow(encabezadosComunes.concat('DER. EXTERNA', 'ASISTENCIA', 'DIAGNÓSTICO PRESUNTIVO', 'CAUSAS', 'OBSERVACIONES'));
        // Datos
        this.consultasFonoaudiologia.forEach((consulta) => {
          worksheetFonoaudiologia.addRow(Object.values(consulta));
        });
      }
      // Oftalmologia
      if (this.consultasOftalmologia.length !== 0) {
        const worksheetOftalmologia = workbook.addWorksheet('Oftalmologia');
        // Encabezados
        worksheetOftalmologia.addRow([]);
        worksheetOftalmologia.addRow(encabezadosComunes.concat('DER. EXTERNA', 'PRIMERA VEZ', 'CONTROL', 'DEMANDA', 'RECETA', 'PRÓX. CONTROL', 'ANTEOJOS', 'OBSERVACIONES'));
        // Datos
        this.consultasOftalmologia.forEach((consulta) => {
          worksheetOftalmologia.addRow(Object.values(consulta));
        });
      }
      // Prevencion
      if (this.consultasPrevencion.length !== 0) {
        const worksheetPrevencion = workbook.addWorksheet('Prevencion');
        // Encabezados
        worksheetPrevencion.addRow([]);
        worksheetPrevencion.addRow(encabezadosComunes.concat('DER. EXTERNA', 'PROBLEMATICA', 'CONSUMO', 'FRECUENCIA', 'MOTIVO', 'EDAD INICIO', 'OBSERVACIONES'));
        // Datos
        this.consultasPrevencion.forEach((consulta) => {
          worksheetPrevencion.addRow(Object.values(consulta));
        });
      }
      // Social
      if (this.consultasSocial.length !== 0) {
        const worksheetSocial = workbook.addWorksheet('Social');
        // Encabezados
        worksheetSocial.addRow([]);
        worksheetSocial.addRow(encabezadosComunes.concat('DER. EXTERNA', 'DEMANDA', 'OBJ. INFORME', 'ARTICULACION', 'SEGUIMIENTO', 'OBSERVACIONES'));
        // Datos
        this.consultasSocial.forEach((consulta) => {
          worksheetSocial.addRow(Object.values(consulta));
        });
      }
      this.aplicarEstilosConsultas(workbook);
      const buffer = await workbook.xlsx.writeBuffer();

      const nombreArchivo = nombrarArchivo('Consultas');

      // Retorno nombre y buffer
      return { success: true, nombreArchivo, buffer };
    } catch (err) {
      console.error('Error al generar el Excel:', err);
      return { success: false, err };
    }
  }

  aplicarEstilosConsultas(workbook: any): void {
    for (const worksheet of workbook.worksheets) {
      const filaCabecera = worksheet.getRow(2);
      filaCabecera.height = 150;

      filaCabecera.eachCell((cell: any) => {
        cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        // Los ifs del switch no tienen sentido, solo se usan para que se ejecuten una vez el merge y no de error.
        // Podrian estar fuera del switch pero habria que hacer otro switch o 4 ifs.
        switch (worksheet.name) {
          case 'Clinica': {
            if (cell._address === 'A2') {
              this.unirCeldas(worksheet, 'R1:T1', 'DERIVACIONES', 'ffe599');
              this.unirCeldas(worksheet, 'Y1:Z1', 'mm     Hg', 'ffe599');
              this.unirCeldas(worksheet, 'AH1:AM1', 'ANTECEDENTES', 'ffe599');
              this.unirCeldas(worksheet, 'AO1:AQ1', 'HS. DIARIAS DE', 'ffe599');
            }
            const celdasARotar = ['Q2', 'R2', 'S2', 'F2', 'T2'];
            const celdasChicas = ['V2', 'AB2', 'AC2', 'AD2', 'AE2', 'Y2', 'X2', 'Z2', 'AL2', 'L2', 'AF2', 'AG2', 'AH2', 'AI2', 'AJ2', 'AK2'];
            this.procesarCeldaSegunHoja(worksheet, cell, celdasARotar, celdasChicas);
            break;
          }
          case 'Odontologia': {
            const celdasARotar = ['Y2', 'Z2', 'AA2', 'Q2', 'R2', 'S2', 'T2', 'U2', 'F2', 'V2', 'W2', 'X2'];
            const celdasChicas = ['L2'];
            this.procesarCeldaSegunHoja(worksheet, cell, celdasARotar, celdasChicas);
            if (cell._address === 'A2') {
              this.unirCeldas(worksheet, 'T1:Z1', 'PRESTACIÓN', 'ffe599');
            }
            break;
          }
          case 'Fonoaudiologia': {
            const celdasARotar = ['F2', 'V2', 'Q2'];
            const celdasChicas = ['L2'];
            this.procesarCeldaSegunHoja(worksheet, cell, celdasARotar, celdasChicas);
            break;
          }
          case 'Oftalmologia': {
            const celdasARotar = ['F2', 'Q2'];
            const celdasChicas = ['L2'];
            this.procesarCeldaSegunHoja(worksheet, cell, celdasARotar, celdasChicas);
            break;
          }
          case 'Prevencion': {
            const celdasARotar = ['F2', 'Q2'];
            const celdasChicas = ['L2'];
            this.procesarCeldaSegunHoja(worksheet, cell, celdasARotar, celdasChicas);
            break;
          }
          case 'Social': {
            const celdasARotar = ['F2', 'Q2'];
            const celdasChicas = ['L2'];
            this.procesarCeldaSegunHoja(worksheet, cell, celdasARotar, celdasChicas);
            break;
          }
        }

        cell.font = { bold: true, name: 'arial', size: 10 };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'd9d9d9' }, // Gris
          // fgColor: { argb: '4a86e8' }, // Azul
        };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
      // Estilos Worksheet
      worksheet.views = [
        {
          state: 'frozen',
          xSplit: 1,
        },
      ];

      // Estilos celdas
      worksheet.eachRow((row: any, rowNumber: any) => {
        // IF para evitar cambiar estilos de cabecera y de celdas unidas
        if (rowNumber > 2) {
          row.eachCell((cell: any) => {
            cell.font = { name: 'arial', size: 10 };
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
          });
        }
      });
    }
  }

  ajustarAnchoDeColumna(worksheet: any, address: string) {
    const columnLetter = address.replace(/\d/g, '');
    const col = worksheet.getColumn(columnLetter);
    const valores = col?.values?.slice(2);
    col.width = valores?.map((valor: number) => (valor ? valor.toString().length : 10)).reduce((max: number, longitud: number) => Math.max(max, longitud), 10) + 2 || 10;
    col.width = Math.min(col.width, 100); // Limita el ancho máximo a 100
  }

  unirCeldas(worksheet: any, rango: string, texto: string, color: string) {
    worksheet.mergeCells(rango);
    const celda = worksheet.getCell(rango.split(':')[0]);
    celda.value = texto;
    celda.font = { bold: true, name: 'arial', size: 12 };
    celda.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: color } };
    celda.alignment = { horizontal: 'center' };
  }

  procesarCeldaSegunHoja(worksheet: any, cell: any, celdasARotar: string[], celdasChicas: string[]) {
    cell.font = { bold: true, name: 'arial', size: 10 };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'd9d9d9' }, // Gris
      // fgColor: { argb: '4a86e8' }, // Azul
    };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };

    const address = cell.address;
    const columnLetter = address.replace(/\d/g, '');

    if (celdasARotar.length > 0 && celdasARotar.includes(address)) {
      const col = worksheet.getColumn(columnLetter);
      cell.alignment.textRotation = 90;
      col.width = 6;
    } else if (celdasChicas.length > 0 && celdasChicas.includes(address)) {
      const col = worksheet.getColumn(columnLetter);
      col.width = 7;
    } else {
      this.ajustarAnchoDeColumna(worksheet, address);
    }
  }

  prepararConsultas(consultas: any[]) {
    Object.values(consultas).forEach((consulta) => {
      const { id, updated_at, obra_social, created_at, type, turno, edad, observaciones, chico, institucion, curso, usuario, ...datosEspecificos } = consulta;
      const fechaConsulta = DateTime.fromISO(created_at.toISOString().slice(0, 10), { zone: 'utc' }).toFormat('dd-MM-yyyy');
      const fechaNacimientoDate = new Date(chico.fe_nacimiento);
      const fechaNacimiento = DateTime.fromISO(fechaNacimientoDate.toISOString(), { zone: 'utc' }).toFormat('dd-MM-yyyy');

      const generales = {
        nombreYApellido: chico.nombre + ' ' + chico.apellido,
        dni: chico.dni,
        fecha: fechaConsulta,
        fechaNac: fechaNacimiento,
        sexo: chico.sexo,
        obraSocial: obra_social ? 'Si' : 'No',
        direccion: chico.direccion,
        barrio: chico.barrio.nombre,
        telefono: chico.telefono === null || chico.telefono === undefined ? '-' : chico.telefono,
        nombrePadre: chico.nombre_padre ? chico.nombre_padre : '-',
        nombreMadre: chico.nombre_madre ? chico.nombre_madre : '-',
        edad: edad,
        institucion: institucion?.nombre,
        curso: curso?.nombre,
        turno: turno,
        profesional: usuario?.nombre + ' ' + usuario?.apellido,
      };
      let especificos;
      switch (consulta['type']) {
        case 'Clinica':
          especificos = {
            esClinica: datosEspecificos.clinica.es_clinica ? 'Si' : 'No',
            derivacionOdontologia: datosEspecificos.derivacion_odontologia ? 'Si' : 'No',
            derivacionFonoaudiologia: datosEspecificos.derivacion_fonoaudiologia ? 'Si' : 'No',
            derivacionOftalmologia: datosEspecificos.derivacion_oftalmologia ? 'Si' : 'No',
            leche: existeItem(datosEspecificos.clinica.leche) ? '-' : datosEspecificos.clinica.leche === true ? 'Si' : 'No',
            segto: datosEspecificos.clinica.segto ? 'Si' : 'No',
            ta: existeItem(datosEspecificos.clinica.tension_arterial) ? '-' : datosEspecificos.clinica.tension_arterial,
            pcta: existeItem(datosEspecificos.clinica.pcta) ? '-' : datosEspecificos.clinica.pcta,
            tas: existeItem(datosEspecificos.clinica.tas) ? '-' : datosEspecificos.clinica.tas,
            tad: existeItem(datosEspecificos.clinica.tad) ? '-' : datosEspecificos.clinica.tad,
            estadoNutricional: datosEspecificos.clinica.estado_nutricional,
            pcimc: datosEspecificos.clinica.pcimc,
            imc: parseFloat(datosEspecificos.clinica.imc).toFixed(2),
            cc: datosEspecificos.clinica.cc,
            pct: datosEspecificos.clinica.pct,
            talla: datosEspecificos.clinica.talla,
            peso: datosEspecificos.clinica.peso,
            consumoTabaco: existeItem(datosEspecificos.clinica.consumo_tabaco) ? '-' : datosEspecificos.clinica.consumo_tabaco === true ? 'Si' : 'No',
            consumoDrogas: existeItem(datosEspecificos.clinica.consumo_drogas) ? '-' : datosEspecificos.clinica.consumo_drogas === true ? 'Si' : 'No',
            obesidad: existeItem(datosEspecificos.clinica.obesidad) ? '-' : datosEspecificos.clinica.obesidad === true ? 'Si' : 'No',
            consumoAlcohol: existeItem(datosEspecificos.clinica.consumo_alcohol) ? '-' : datosEspecificos.clinica.consumo_alcohol === true ? 'Si' : 'No',
            hta: existeItem(datosEspecificos.clinica.hta) ? '-' : datosEspecificos.clinica.hta === true ? 'Si' : 'No',
            dbt: existeItem(datosEspecificos.clinica.diabetes) ? '-' : datosEspecificos.clinica.diabetes === true ? 'Si' : 'No',
            hidratacion: existeItem(datosEspecificos.clinica.hidratacion) ? '-' : datosEspecificos.clinica.hidratacion,
            horasSuenio: existeItem(datosEspecificos.clinica.horas_suenio) ? '-' : datosEspecificos.clinica.horas_suenio,
            horasJuegoAireLibre: existeItem(datosEspecificos.clinica.horas_juego_aire_libre) ? '-' : datosEspecificos.clinica.horas_juego_aire_libre,
            horasPantalla: existeItem(datosEspecificos.clinica.horas_pantalla) ? '-' : datosEspecificos.clinica.horas_pantalla,
            cantidadComidas: existeItem(datosEspecificos.clinica.cantidad_comidas) ? '-' : datosEspecificos.clinica.cantidad_comidas,
            infusiones: existeItem(datosEspecificos.clinica.infusiones) ? '-' : datosEspecificos.clinica.infusiones,
            alimentacion: existeItem(datosEspecificos.clinica.alimentacion) ? '-' : datosEspecificos.clinica.alimentacion,
            lenguaje: existeItem(datosEspecificos.clinica.lenguaje) ? '-' : datosEspecificos.clinica.lenguaje,
            ortopediaTraumatologia: existeItem(datosEspecificos.clinica.ortopedia_traumatologia) ? '-' : datosEspecificos.clinica.ortopedia_traumatologia,
            examenVisual: existeItem(datosEspecificos.clinica.examen_visual) ? '-' : datosEspecificos.clinica.examen_visual,
            vacunas: existeItem(datosEspecificos.clinica.vacunas) ? '-' : datosEspecificos.clinica.vacunas,
            enfPrevias: existeItem(datosEspecificos.clinica.enfermedades_previas) ? '-' : datosEspecificos.clinica.enfermedades_previas ? 'Si' : 'No',
            antPerinatales: existeItem(datosEspecificos.clinica.antecedentes_perinatal) ? '-' : datosEspecificos.clinica.antecedentes_perinatal ? 'Si' : 'No',
            observaciones: observaciones || '-',
          };
          this.consultasClinica.push(Object.assign({}, generales, especificos));
          break;
        case 'Odontologia':
          especificos = {
            derivacionExterna: datosEspecificos.derivacion_externa ? 'Si' : 'No',
            primeraVez: datosEspecificos.odontologia.primera_vez ? 'Si' : 'No',
            ulterior: datosEspecificos.odontologia.ulterior ? 'Si' : 'No',
            dientesPermanentes: datosEspecificos.odontologia.dientes_permanentes,
            dientesTemporales: datosEspecificos.odontologia.dientes_temporales,
            sellador: datosEspecificos.odontologia.sellador,
            topificacion: datosEspecificos.odontologia.topificacion ? 'Si' : 'No',
            cepillado: datosEspecificos.odontologia.cepillado ? 'Si' : 'No',
            dientesRecuperables: datosEspecificos.odontologia.dientes_recuperables,
            dientesIrecuperables: datosEspecificos.odontologia.dientes_irecuperables,
            cepillo: datosEspecificos.odontologia.cepillo ? 'Si' : 'No',
            clasificacion: datosEspecificos.odontologia.clasificacion,
            habitos: datosEspecificos.odontologia.habitos || '-',
            observaciones: observaciones || '-',
          };
          this.consultasOdontologia.push(Object.assign({}, generales, especificos));
          break;
        case 'Oftalmologia':
          const fechaProxControlDate = new Date(datosEspecificos.oftalmologia.prox_control);
          const fechaProxControl = DateTime.fromISO(fechaProxControlDate.toISOString(), { zone: 'utc' }).toFormat('dd-MM-yyyy');
          especificos = {
            derivacionExterna: datosEspecificos.derivacion_externa ? 'Si' : 'No',
            primeraVez: datosEspecificos.oftalmologia.primera_vez ? 'Si' : 'No',
            control: datosEspecificos.oftalmologia.control ? 'Si' : 'No',
            demanda: datosEspecificos.oftalmologia.demanda,
            receta: datosEspecificos.oftalmologia.receta ? 'Si' : 'No',
            proxControl: fechaProxControl,
            anteojos: datosEspecificos.oftalmologia.anteojos !== null ? (datosEspecificos.oftalmologia.anteojos === true ? 'Si' : 'No') : '-',
            observaciones: observaciones || '-',
          };
          this.consultasOftalmologia.push(Object.assign({}, generales, especificos));
          break;
        case 'Fonoaudiologia':
          especificos = {
            derivacionExterna: datosEspecificos.derivacion_externa ? 'Si' : 'No',
            asistencia: datosEspecificos.fonoaudiologia.asistencia ? 'Si' : 'No',
            diagnosticoPresuntivo: datosEspecificos.fonoaudiologia.diagnostico_presuntivo,
            causas: datosEspecificos.fonoaudiologia.causas,
            observaciones: observaciones || '-',
          };
          this.consultasFonoaudiologia.push(Object.assign({}, generales, especificos));
          break;
        case 'Prevencion':
          especificos = {
            derivacionExterna: datosEspecificos.derivacion_externa ? 'Si' : 'No',
            problematica: datosEspecificos.prevencion.otra_problematica,
            consumoProblematico: existeItem(datosEspecificos.prevencion.consumo_problematico) ? '-' : datosEspecificos.prevencion.consumo_problematico,
            frecuencia: existeItem(datosEspecificos.prevencion.frecuencia) ? '-' : datosEspecificos.prevencion.frecuencia,
            motivoConsumo: existeItem(datosEspecificos.prevencion.motivo_consumo) ? '-' : datosEspecificos.prevencion.motivo_consumo,
            edadInicioConsumo: existeItem(datosEspecificos.prevencion.edad_inicio_consumo) ? '-' : datosEspecificos.prevencion.edad_inicio_consumo,
            observaciones: observaciones || '-',
          };
          this.consultasPrevencion.push(Object.assign({}, generales, especificos));
          break;
        case 'Social':
          especificos = {
            derivacionExterna: datosEspecificos.derivacion_externa ? 'Si' : 'No',
            demanda: datosEspecificos.social.demanda,
            objetoInforme: datosEspecificos.social.objeto_informe,
            articulacion: existeItem(datosEspecificos.social.articulacion) ? '-' : datosEspecificos.social.articulacion,
            seguimiento: existeItem(datosEspecificos.social.seguimiento) ? '-' : datosEspecificos.social.seguimiento,
            observaciones: observaciones || '-',
          };
          this.consultasSocial.push(Object.assign({}, generales, especificos));
          break;
      }
    });
  }
}

function existeItem(valor: any): boolean {
  return valor === null || valor === undefined;
}

function calcularEdad(fechaNacimiento, fechaConsulta) {
  const nacimiento = new Date(fechaNacimiento);
  let edad = fechaConsulta.getFullYear() - nacimiento.getFullYear();
  const mes = fechaConsulta.getMonth() - nacimiento.getMonth();

  // Ajusta la edad si el mes o el día de hoy es menor que el mes o el día de nacimiento
  if (mes < 0 || (mes === 0 && fechaConsulta.getDate() < nacimiento.getDate())) {
    edad--;
  }

  return edad;
}

function nombrarArchivo(tipoArchivo) {
  const hoy = new Date();
  const dia = hoy.getDate().toString().padStart(2, '0');
  const mes = (hoy.getMonth() + 1).toString().padStart(2, '0');
  const anio = hoy.getFullYear();
  // Hora
  const horas = hoy.getHours();
  const minutos = hoy.getMinutes().toString().padStart(2, '0');
  const ampm = horas >= 12 ? 'PM' : 'AM';
  const horas12 = (horas % 12 || 12).toString();
  const segundos = hoy.getSeconds().toString().padStart(2, '0');
  const nombreArchivo = `${tipoArchivo}-${dia}_${mes}_${anio}, ${horas12}_${minutos}_${segundos}_${ampm}.xlsx`;
  return nombreArchivo;
}
