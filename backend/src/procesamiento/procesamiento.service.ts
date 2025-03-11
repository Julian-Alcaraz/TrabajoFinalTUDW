import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chico } from 'src/chico/entities/chico.entity';
import { Curso } from 'src/curso/entities/curso.entity';
import { Institucion } from 'src/institucion/entities/institucion.entity';
import { Fonoaudiologia } from 'src/consulta/entities/fonoaudiologia.entity';
import { Oftalmologia } from 'src/consulta/entities/oftalmologia.entity';
import { Odontologia } from 'src/consulta/entities/odontologia.entity';
import { Clinica } from 'src/consulta/entities/clinica.entity';
import { Consulta } from 'src/consulta/entities/consulta.entity';
import { Repository } from 'typeorm';
import { Barrio } from 'src/barrio/entities/barrio.entity';

@Injectable()
export class ProcesamientoService {
  constructor(
    @InjectRepository(Consulta) private readonly consultaORM: Repository<Consulta>,
    @InjectRepository(Clinica) private readonly clinicaORM: Repository<Clinica>,
    @InjectRepository(Odontologia) private readonly odontologiaORM: Repository<Odontologia>,
    @InjectRepository(Oftalmologia) private readonly oftalmologiaORM: Repository<Oftalmologia>,
    @InjectRepository(Fonoaudiologia) private readonly fonoaudiologiaORM: Repository<Fonoaudiologia>,
    // chico,institucion, curso
    @InjectRepository(Institucion) private readonly institucionORM: Repository<Institucion>,
    @InjectRepository(Curso) private readonly cursoORM: Repository<Curso>,
    @InjectRepository(Barrio) private readonly barrioORM: Repository<Barrio>,
    @InjectRepository(Chico) private readonly chicoORM: Repository<Chico>,
  ) {}
  // se va a ir
  delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async procesarClinica(data: any) {
    let log = true;
    const institucionCargadas = await this.institucionORM.find();

    const cursosCargados = await this.cursoORM.find();
    console.log(institucionCargadas, cursosCargados);
    console.log(console.log(data[0])); // esta data es un excel de carga
    const noCargados = [];
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      try {
        if (log) console.log(row);
        if (!data.DNI) {
          row.dni = 11111111 + i;
          // esto es lo que va
          // throw new Error('Dni no enviado');
          // row.posicionExcel = i + 1;
          // row.motivo = 'Dni no enviado';
          // noCargados.push(row);
          // continue;
        }
        const chico = await this.chicoORM.find({ where: { dni: row.dni } });
        if (log) console.log('respuesta de chico si lo encuentra o no', chico);
        if (chico.length == 0) {
          // no se encontro el chico, insertar los datos
          const chico = new Chico();
          chico.dni = row.DNI;
          // ver como hago lo del nombre !!!!!!!!!!!
          chico.nombre = row['NOMBRE Y APELLIDO'];
          chico.apellido = '';
          chico.created_at = new Date(row['FECHA']);
          chico.barrio = await this.verificarBarrio(row['BARRIO'], true); // inserta el barrio si no lo encuentra, si devuelve null no podemos ingresar el chico
          if (!chico.barrio) {
            throw new Error('Barrio no existente ni cargado por el sistema');
            // row.posicionExcel = i + 1;
            // row.motivo = 'Barrio no existen ni cargado por el sist';
            // noCargados.push(row);
            // continue;
          }
          chico.direccion = row['DIRECCION'];
          chico.fe_nacimiento = row['FECHA DE NACIMIENTO'];
          chico.nombre_madre = row['NOMBRE Y APELLIDO MADRE'];
          chico.nombre_padre = row['NOMBRE Y APELLIDO PADRE'];
          chico.sexo = row['SEXO'];
          chico.telefono = row['TELEFONO'];
          // guardo el chico, en teoria si da error se va al catch, descomentar para empezar a trabajar sobre la bd
          const chicoNuevo = this.chicoORM.create(chico);
          this.chicoORM.save(chicoNuevo);

          const consulta = new Consulta();
          consulta.chico = chicoNuevo;
          consulta.created_at = new Date(row['FECHA']);
          consulta.curso = await this.verificarCurso(convertirCurso(row['CURSO']));
          consulta.edad = calcularEdad(new Date(row['FECHA DE NACIMIENTO']), consulta.created_at);
          consulta.institucion = await this.verificarInstitucion(row['INSTITUCION']);
          consulta.obra_social = convertirObraSocial(row['OBRA SOCIAL']);
          consulta.type = 'Clinica';
          consulta.observaciones = row['OBSERVACIONES'];
          consulta.derivacion_externa = false;
          consulta.derivacion_fonoaudiologia = convertirDerivacion(row['FONOAUDIOLOGÍA']);
          consulta.derivacion_odontologia = false;
          consulta.derivacion_oftalmologia = convertirDerivacion(row['OFTALMOLOGÍA']);
          // consulta.derivacion_trabajoSocial // esto nose que onda hay que desarrollarlo
          // consulta.derivacion_pediatria // esto nunca existio !!!!!!!!!!
          // todavia falta......

          // consulta.usuario= // esto tengo que ver

          if (log) console.log(chico);
          if (log) console.log(consulta);
          log = false;
        }
      } catch (error) {
        console.error(`Error al procesar la fila ${i + 1}:`, error);
        row.posicionExcel = i + 1;
        row.motivo = `Error: ${error.message}`;
        noCargados.push(row);
      }
    }
    // verfico el dni

    await this.delay(2900);
    return noCargados;
  }

  async verificarBarrio(barrio: string, insertar: boolean = false): Promise<null | Barrio> {
    let barrioBd: any = this.barrioORM.findOneBy({ nombre: barrio });
    if (!barrioBd && insertar) {
      barrioBd = this.barrioORM.create({ nombre: barrio }); // puede que le falte la localidad !!!!!!!!!!
      await this.barrioORM.save(barrioBd);
    }
    if (!barrioBd) {
      return null;
    }
    return barrioBd;
  }

  async verificarInstitucion(institucion: string, insertar: boolean = false): Promise<null | Institucion> {
    let institucionBd: any = this.institucionORM.findOneBy({ nombre: institucion });
    if (!institucionBd && insertar) {
      institucionBd = this.institucionORM.create({ nombre: institucion, tipo: 'Primario' }); // lo pongo fijo, se puede cambiar!!!!!!!!!!
      await this.institucionORM.save(institucionBd);
    }
    if (!institucionBd) {
      return null;
    }
    return institucionBd;
  }

  async verificarCurso(curso: string, insertar: boolean = false): Promise<null | Curso> {
    let cursoBd: any = this.cursoORM.findOneBy({ nombre: curso });
    if (!cursoBd && insertar) {
      cursoBd = this.cursoORM.create({ nombre: curso });
      await this.cursoORM.save(cursoBd);
    }
    if (!cursoBd) {
      return null;
    }
    return cursoBd;
  }

  async procesarOftalmologia(data: object) {
    console.log(console.log(data));
    return true;
  }

  async procesarOdontologia(data: object) {
    console.log(console.log(data));
    return true;
  }

  async procesarFonoaudiologia(data: object) {
    console.log(console.log(data));
    return true;
  }
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
function convertirCurso(curso: string): string {
  const conversiones: { [key: string]: string } = {
    '1er Grado': 'Primer Grado',
    '2do Grado': 'Segundo Grado',
    '3er Grado': 'Tercer Grado',
    '4to Grado': 'Cuarto Grado',
    '5to Grado': 'Quinto Grado',
    '6to Grado': 'Sexto Grado',
    '7mo Grado': 'Septimo Grado',
  };

  return conversiones[curso] || curso;
}
function convertirObraSocial(obra) {
  return obra === 'Si';
}
function convertirDerivacion(derivacion) {
  return derivacion === 'SI';
}
