import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import * as ExcelJS from 'exceljs';

@Injectable({
  providedIn: 'root',
})
export class XlsxService {
  private consultasClinicas: any[] = [];
  private consultasFonoaudiologicas: any[] = [];
  private consultasOftalmologicas: any[] = [];
  private consultasOdontologicas: any[] = [];

  async generarXlsx(consultas: any) {
    try {
      this.prepararConsultas(consultas);
      const encabezadosComunes = ['NOMBRE Y APELLIDO', 'DNI', 'FECHA', 'FECHA NAC.', 'SEXO', 'OBRA SOCIAL', 'DIRECCIÓN', 'BARRIO', 'TELÉFONO', 'NOMBRE PADRE', 'NOMBRE MADRE', 'EDAD', 'INSTITUCIÓN', 'SALA/GRADO', 'TURNO', 'PROFESIONAL'];
      const workbook = new ExcelJS.Workbook();
      // Clinica
      if (this.consultasClinicas.length !== 0) {
        const worksheetClinica = workbook.addWorksheet('Clinica');
        // Encabezados
        worksheetClinica.addRow([]);
        worksheetClinica.addRow(encabezadosComunes.concat('ODONTOLOGÍA', 'FONOAUDIOLOGÍA', 'OFTALMOLOGÍA', 'LECHE', 'SEGTO', 'TA', 'PCTA', 'TAS', 'TAD', 'ESTADO NUTRICIONAL', 'PCIMC', 'IMC', 'CC (cm)', 'PCT (T/E)', 'TALLA (cm)', 'PESO (kg)', 'CP-BQ', 'CP-D', 'O', 'CP-OH', 'HTA', 'DBT', 'HIDRATACIÓN', 'SUEÑO', 'JUEGO AL AIRE LIBRE', 'PANTALLA', 'Nº COMIDAS AL DÍA', 'INFUSIONES', 'ALIMENTACIÓN', 'LENGUAJE', 'O Y T', 'EX. VISUAL', 'VACUNAS', 'ENF. PREVIAS', 'ANT. PERINATALES', 'OBSERVACIONES'));
        // Datos
        this.consultasClinicas.forEach((consulta) => {
          worksheetClinica.addRow(Object.values(consulta));
        });
      }
      // Odontologia
      if (this.consultasOdontologicas.length !== 0) {
        const worksheetOdontologia = workbook.addWorksheet('Odontologia');
        // Encabezados
        worksheetOdontologia.addRow([]);
        worksheetOdontologia.addRow(encabezadosComunes.concat('DER. EXTERNA', 'PRIMERA VEZ', 'ULTERIOR', 'TOTAL PERMANENTES', 'TOTAL TEMPORARIOS', 'SELLADOR', 'TOPIFICACIÓN', 'ENS. CEPILLADO', 'DIENTE RECUPERABLE', 'DIENTES NO RECUPERABLE', 'CEPILLO', 'CLASIFICACIÓN', 'HÁBITOS', 'OBSERVACIONES'));
        // Datos
        this.consultasOdontologicas.forEach((consulta) => {
          worksheetOdontologia.addRow(Object.values(consulta));
        });
      }
      // Fonoaudiologia
      if (this.consultasFonoaudiologicas.length !== 0) {
        const worksheetFonoaudiologia = workbook.addWorksheet('Fonoaudiologia');
        // Encabezados
        worksheetFonoaudiologia.addRow([]);
        worksheetFonoaudiologia.addRow(encabezadosComunes.concat('DER. EXTERNA', 'ASISTENCIA', 'DIAGNÓSTICO PRESUNTIVO', 'CAUSAS', 'OBSERVACIONES'));
        // Datos
        this.consultasFonoaudiologicas.forEach((consulta) => {
          worksheetFonoaudiologia.addRow(Object.values(consulta));
        });
      }
      // Oftalmologia
      if (this.consultasOftalmologicas.length !== 0) {
        const worksheetOftalmologia = workbook.addWorksheet('Oftalmologia');
        // Encabezados
        worksheetOftalmologia.addRow([]);
        worksheetOftalmologia.addRow(encabezadosComunes.concat('DER. EXTERNA', 'PRIMERA VEZ', 'CONTROL', 'DEMANDA', 'RECETA', 'PRÓX. CONTROL', 'ANTEOJOS', 'OBSERVACIONES'));
        // Datos
        this.consultasOftalmologicas.forEach((consulta) => {
          worksheetOftalmologia.addRow(Object.values(consulta));
        });
      }
      this.aplicarEstilos(workbook);
      const buffer = await workbook.xlsx.writeBuffer();
      // Fecha
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
      const nombreArchivo = `Consultas-${dia}_${mes}_${anio}, ${horas12}_${minutos}_${segundos}_${ampm}.xlsx`;
      // Guardar archivo
      saveAs(new Blob([buffer]), nombreArchivo);
      return { success: true, message: 'XLS descargado con éxito' };
    } catch (err) {
      console.error('Error al generar el Excel:', err);
      return { success: false, message: 'Error al generar el XLS ', err };
    }
  }

  aplicarEstilos(workbook: any): void {
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
              this.unirCeldas(worksheet, 'Q1:S1', 'DERIVACIONES', 'ffe599');
              this.unirCeldas(worksheet, 'X1:Y1', 'mm     Hg', 'ffe599');
              this.unirCeldas(worksheet, 'AN1:AP1', 'HS. DIARIAS DE', 'ffe599');
              this.unirCeldas(worksheet, 'AG1:AL1', 'ANTECEDENTES', 'ffe599');
            }
            const celdasARotar = ['Q2', 'R2', 'S2', 'F2'];
            const celdasChicas = ['AA2', 'AB2', 'AC2', 'AD2', 'AE2', 'Y2', 'X2', 'W2', 'AL2', 'L2', 'AF2', 'AG2', 'AH2', 'AI2', 'AJ2', 'AK2'];
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

    if (celdasARotar.includes(address)) {
      const col = worksheet.getColumn(columnLetter);
      cell.alignment.textRotation = 90;
      col.width = 6;
    } else if (celdasChicas.includes(address)) {
      const col = worksheet.getColumn(columnLetter);
      col.width = 7;
    } else {
      this.ajustarAnchoDeColumna(worksheet, address);
    }
  }

  prepararConsultas(consultas: any) {
    consultas.map((consulta: any) => {
      const { id, updated_at, obra_social, created_at, type, turno, edad, observaciones, chico, institucion, curso, usuario, fe_nacimiento, ...datosEspecificos } = consulta;
      const generales = {
        nombreYApellido: chico.nombre + ' ' + chico.apellido,
        dni: chico.dni,
        fecha: created_at,
        fechaNac: chico.fe_nacimiento,
        sexo: chico.sexo,
        obraSocial: obra_social ? 'Si' : 'No',
        direccion: chico.direccion,
        barrio: chico.barrio.nombre,
        telefono: chico.telefono,
        nombrePadre: chico.nombre_padre ? chico.nombre_padre : '-',
        nombreMadre: chico.nombre_madre ? chico.nombre_madre : '-',
        edad: edad,
        institucion: institucion?.nombre,
        curso: curso?.nombre,
        turno: turno,
        profesional: usuario?.nombre + ' ' + usuario?.apellido,
      };
      let especificos;
      switch (consulta.type) {
        case 'Clinica':
          especificos = {
            derivacionOdontologia: datosEspecificos.derivacion_odontologia ? 'Si' : 'No',
            derivacionFonoaudiologia: datosEspecificos.derivacion_fonoaudiologia ? 'Si' : 'No',
            derivacionOftalmologia: datosEspecificos.derivacion_oftalmologia ? 'Si' : 'No',
            leche: datosEspecificos.clinica.leche ? 'Si' : 'No',
            segto: datosEspecificos.clinica.segto ? 'Si' : 'No',
            ta: datosEspecificos.clinica.tension_arterial,
            pcta: datosEspecificos.clinica.pcta,
            tas: datosEspecificos.clinica.tas,
            tad: datosEspecificos.clinica.tad,
            estadoNutricional: datosEspecificos.clinica.estado_nutricional,
            pcimc: datosEspecificos.clinica.pcimc,
            imc: parseFloat(datosEspecificos.clinica.imc).toFixed(2),
            cc: datosEspecificos.clinica.cc,
            pct: datosEspecificos.clinica.pct,
            talla: datosEspecificos.clinica.talla,
            peso: datosEspecificos.clinica.peso,
            consumoTabaco: datosEspecificos.clinica.consumo_tabaco ? 'Si' : 'No',
            consumoDrogas: datosEspecificos.clinica.consumo_drogas ? 'Si' : 'No',
            obesidad: datosEspecificos.clinica.obesidad ? 'Si' : 'No',
            consumoAlcohol: datosEspecificos.clinica.consumo_alcohol ? 'Si' : 'No',
            hta: datosEspecificos.clinica.hta ? 'Si' : 'No',
            dbt: datosEspecificos.clinica.diabetes ? 'Si' : 'No',
            hidratacion: datosEspecificos.clinica.hidratacion,
            horasSuenio: datosEspecificos.clinica.horas_suenio,
            horasJuegoAireLibre: datosEspecificos.clinica.horas_juego_aire_libre,
            horasPantalla: datosEspecificos.clinica.horas_pantalla,
            cantidadComidas: datosEspecificos.clinica.cantidad_comidas,
            infusiones: datosEspecificos.clinica.infusiones,
            alimentacion: datosEspecificos.clinica.alimentacion,
            lenguaje: datosEspecificos.clinica.lenguaje,
            ortopediaTraumatologia: datosEspecificos.clinica.ortopedia_traumatologia,
            examenVisual: datosEspecificos.clinica.examen_visual,
            vacunas: datosEspecificos.clinica.vacunas,
            enfPrevias: datosEspecificos.clinica.enfermedades_previas ? 'Si' : 'No',
            antPerinatales: datosEspecificos.clinica.antecedentes_perinatal ? 'Si' : 'No',
            observaciones: observaciones || '-',
          };
          this.consultasClinicas.push(Object.assign({}, generales, especificos));
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
          this.consultasOdontologicas.push(Object.assign({}, generales, especificos));
          break;
        case 'Oftalmologia':
          especificos = {
            derivacionExterna: datosEspecificos.derivacion_externa ? 'Si' : 'No',
            primeraVez: datosEspecificos.oftalmologia.primera_vez ? 'Si' : 'No',
            control: datosEspecificos.oftalmologia.control ? 'Si' : 'No',
            demanda: datosEspecificos.oftalmologia.demanda,
            receta: datosEspecificos.oftalmologia.receta ? 'Si' : 'No',
            proxControl: datosEspecificos.oftalmologia.prox_control, // DAR FORMATO A ESTA FECHA!!!
            anteojos: datosEspecificos.oftalmologia.anteojos !== null ? (datosEspecificos.oftalmologia.anteojos === true ? 'Si' : 'No') : '-',
            observaciones: observaciones || '-',
          };
          this.consultasOftalmologicas.push(Object.assign({}, generales, especificos));
          break;
        case 'Fonoaudiologia':
          especificos = {
            derivacionExterna: datosEspecificos.derivacion_externa ? 'Si' : 'No',
            asistencia: datosEspecificos.fonoaudiologia.asistencia ? 'Si' : 'No',
            diagnosticoPresuntivo: datosEspecificos.fonoaudiologia.diagnostico_presuntivo,
            causas: datosEspecificos.fonoaudiologia.causas,
            observaciones: observaciones || '-',
          };
          this.consultasFonoaudiologicas.push(Object.assign({}, generales, especificos));
          break;
      }
    });
  }
}
