import { Injectable } from '@nestjs/common';
import { ConsultaService } from '../consulta/consulta.service';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import * as Papa from 'papaparse';

@Injectable()
export class CsvService {
  constructor(private readonly consultaService: ConsultaService) {}
  async generarCsv(consultaPersonalizada: any) {
    const consultas = await this.consultaService.busquedaPersonalizada(consultaPersonalizada);
    const consultasFormateadas = consultas.map((consulta) => {
      const { updated_at, id, sexo, direccion, deshabilitado, obra_social, derivaciones, created_at, type, turno, edad, observaciones, chico, institucion, curso, usuario, ...datosEspecificos } = consulta;
      const fechaCreacion = new Date(created_at);
      const generales = {
        Fecha: `${fechaCreacion.getDate().toString().padStart(2, '0')}-${(fechaCreacion.getMonth() + 1).toString().padStart(2, '0')}-${fechaCreacion.getFullYear()}`,
        Nombre: chico?.nombre,
        Apellido: chico?.apellido,
        Sexo: chico.sexo,
        DNI: chico?.dni,
        Edad: edad,
        Direccion: chico?.direccion,
        Institucion: institucion?.nombre,
        Curso: curso?.nombre,
        Turno: turno,
        ObraSocial: obra_social ? 'Si' : 'No',
        TipoConsulta: type,
        DerivacionClinica: derivaciones.clinica ? 'Si' : 'No',
        DerivacionOdontologia: derivaciones.odontologia ? 'Si' : 'No',
        DerivacionFonoaudiologia: derivaciones.fonoaudiologia ? 'Si' : 'No',
        DerivacionOftalmologia: derivaciones.oftalmologia ? 'Si' : 'No',
        Profesional: usuario?.nombre + ' ' + usuario?.apellido,
      };
      let especificos;
      switch (consulta.type) {
        case 'Clinica':
          especificos = {
            Leche: datosEspecificos.clinica.leche ? 'Si' : 'No',
            Segto: datosEspecificos.clinica.segto ? 'Si' : 'No',
            TA: datosEspecificos.clinica.tension_arterial,
            PCTA: datosEspecificos.clinica.pcta,
            TAS: datosEspecificos.clinica.tas,
            EstadoNutricional: datosEspecificos.clinica.estado_nutricional,
            PCIMC: datosEspecificos.clinica.pcimc,
            IMC: parseFloat(datosEspecificos.clinica.imc).toFixed(2),
            CC: datosEspecificos.clinica.cc,
            PCT: datosEspecificos.clinica.pct,
            Talla: datosEspecificos.clinica.talla,
            Peso: datosEspecificos.clinica.peso,
            ConsumoTabaco: datosEspecificos.clinica.consumo_tabaco ? 'Si' : 'No',
            ConsumoDrogas: datosEspecificos.clinica.consumo_drogas ? 'Si' : 'No',
            Obesidad: datosEspecificos.clinica.obesidad ? 'Si' : 'No',
            ConsumoAlcohol: datosEspecificos.clinica.consumo_alcohol ? 'Si' : 'No',
            HTA: datosEspecificos.clinica.hta ? 'Si' : 'No',
            DBT: datosEspecificos.clinica.diabetes ? 'Si' : 'No',
            Hidratacion: datosEspecificos.clinica.hidratacion,
            HorasSuenio: datosEspecificos.clinica.horas_suenio,
            HorasJuegoAireLibre: datosEspecificos.clinica.horas_juego_aire_libre,
            HorasPantalla: datosEspecificos.clinica.horas_pantalla,
            CantidadComidas: datosEspecificos.clinica.cantidad_comidas,
            Infusiones: datosEspecificos.clinica.infusiones,
            Alimentacion: datosEspecificos.clinica.alimentacion,
            Lenguaje: datosEspecificos.clinica.lenguaje,
            OrtopediaTraumatologia: datosEspecificos.clinica.ortopedia_traumatologia,
            ExamenVisual: datosEspecificos.clinica.examen_visual,
            Vacunas: datosEspecificos.clinica.vacunas,
            EnfPrevias: datosEspecificos.clinica.enfermedades_previas ? 'Si' : 'No',
            AntPerinatales: datosEspecificos.clinica.antecedentes_perinatal ? 'Si' : 'No',
            Observaciones: observaciones || '-',
          };
          break;
        case 'Odontologia':
          especificos = {
            PrimeraVez: datosEspecificos.odontologia.primera_vez ? 'Si' : 'No',
            Ulterior: datosEspecificos.odontologia.ulterior ? 'Si' : 'No',
            DientesPermanentes: datosEspecificos.odontologia.dientes_permanentes,
            DientesTemporales: datosEspecificos.odontologia.dientes_temporales,
            DientesRecuperables: datosEspecificos.odontologia.dientes_recuperables,
            DientesIrecuperables: datosEspecificos.odontologia.dientes_irecuperables,
            Sellador: datosEspecificos.odontologia.sellador,
            Topificacion: datosEspecificos.odontologia.topificacion ? 'Si' : 'No',
            Cepillado: datosEspecificos.odontologia.cepillado ? 'Si' : 'No',
            Cepillo: datosEspecificos.odontologia.cepillo ? 'Si' : 'No',
            Clasificacion: datosEspecificos.odontologia.clasificacion,
            Habitos: datosEspecificos.odontologia.habitos || '-',
            Observaciones: observaciones || '-',
          };
          break;
        case 'Oftalmologia':
          const fechaProxControl = new Date(datosEspecificos.oftalmologia.prox_control);
          especificos = {
            PrimeraVez: datosEspecificos.oftalmologia.primera_vez ? 'Si' : 'No',
            Control: datosEspecificos.oftalmologia.control ? 'Si' : 'No',
            Demanda: datosEspecificos.oftalmologia.demanda,
            Receta: datosEspecificos.oftalmologia.receta ? 'Si' : 'No',
            ProxControl: `${fechaProxControl.getDate().toString().padStart(2, '0')}-${(fechaProxControl.getMonth() + 1).toString().padStart(2, '0')}-${fechaProxControl.getFullYear()}`,
            Anteojos: datosEspecificos.oftalmologia.anteojos !== null ? (datosEspecificos.oftalmologia.anteojos === true ? 'Si' : 'No') : '-',
            Observaciones: observaciones || '-',
          };
          break;
        case 'Fonoaudiologia':
          especificos = {
            Asistencia: datosEspecificos.fonoaudiologia.asistencia ? 'Si' : 'No',
            DiagnosticoPresuntivo: datosEspecificos.fonoaudiologia.diagnostico_presuntivo,
            Causas: datosEspecificos.fonoaudiologia.causas,
            Observaciones: observaciones || '-',
          };
          break;
      }
      const resultado = Object.assign(generales, especificos);
      return resultado;
    });
    const csv = Papa.unparse(consultasFormateadas);
    const directorio = path.join(`${__dirname}../../archivos`, `export-consultas-${Date.now()}.csv`);
    if (!fs.existsSync(path.dirname(directorio))) {
      fs.mkdirSync(path.dirname(directorio), { recursive: true });
    }
    fs.writeFileSync(directorio, csv);
    return directorio;
  }

  descargarCsv(nombreArchivo: string, res: Response) {
    const directorio = path.join(`${__dirname}../../archivos`, nombreArchivo);
    if (fs.existsSync(directorio)) {
      try {
        // Intenta descargar el archivo
        res.download(directorio, nombreArchivo, async (err) => {
          if (err) {
            console.error('Error al enviar el archivo:', err);
          }
          try {
            // Intenta eliminar el archivo después de la descarga
            await fs.promises.unlink(directorio);
            console.log(`Archivo ${nombreArchivo} eliminado del servidor.`);
          } catch (unlinkError) {
            console.error('Error al eliminar el archivo:', unlinkError);
          }
        });
      } catch (downloadError) {
        console.error('Error durante la descarga del archivo:', downloadError);
        res.status(500).json({ success: false, message: 'Error al descargar el archivo' });
      }
    } else {
      res.status(404).json({ success: false, message: 'Archivo no encontrado' });
    }
  }
}
