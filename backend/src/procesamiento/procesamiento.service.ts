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
import { Double, Repository } from 'typeorm';
import { Barrio } from 'src/barrio/entities/barrio.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';

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
  async procesarClinica(data: any, usuario: Usuario) {
    let log = true;
    // const institucionCargadas = await this.institucionORM.find();
    // const cursosCargados = await this.cursoORM.find();
    // console.log(institucionCargadas, cursosCargados);
    // console.log(data[0]); // esta data es un excel de carga
    const noCargados = [];
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      try {
        if (log) console.log(row);
        if (!data.DNI) {
          row.DNI = 11111111 + i;
          // esto es lo que va
          // throw new Error('Dni no enviado');
          // row.posicionExcel = i + 1;
          // row.motivo = 'Dni no enviado';
          // noCargados.push(row);
          // continue;
        }
        let chico = await this.chicoORM.findOneBy({ dni: row.DNI });
        if (log) console.log('respuesta de chico si lo encuentra o no', chico);
        if (!chico) {
          // no se encontro el chico, insertar los datos
          chico = new Chico();
          chico.dni = row.DNI;
          // ver como hago lo del nombre !!!!!!!!!!!
          const arrayApyNo = separarNombre(row['NOMBRE Y APELLIDO']);
          chico.nombre = arrayApyNo[1];
          chico.apellido = arrayApyNo[0];
          chico.created_at = new Date(row['FECHA']);
          chico.barrio = await this.verificarBarrio(convertirBarrios(row['BARRIO']), true); // inserta el barrio si no lo encuentra, si devuelve null no podemos ingresar el chico
          if (!chico.barrio) {
            throw new Error('Barrio no existente ni cargado por el sistema ' + row['BARRIO']);
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
          chico = this.chicoORM.create(chico);
          await this.chicoORM.save(chico);
        }
        const consulta = new Consulta();
        consulta.chico = chico;
        consulta.created_at = new Date(row['FECHA']);
        consulta.curso = await this.verificarCurso(convertirCurso(row['CURSO']));
        consulta.edad = calcularEdad(new Date(row['FECHA DE NACIMIENTO']), consulta.created_at);
        // consulta.edad = row.EDAD //pero hay que trabajar el dato
        consulta.institucion = await this.verificarInstitucion(row['INSTITUCION']);
        consulta.obra_social = convertirSiNo(row['OBRA SOCIAL']);
        consulta.type = 'Clinica';
        consulta.observaciones = row['OBSERVACIONES'];
        consulta.derivacion_externa = false;
        consulta.derivacion_fonoaudiologia = convertirSiNo(row['FONOAUDIOLOGÍA']);
        consulta.derivacion_odontologia = false;
        consulta.derivacion_oftalmologia = convertirSiNo(row['OFTALMOLOGÍA']);
        consulta.usuario = usuario;
        // consulta.derivacion_trabajoSocial // esto nose que onda hay que desarrollarlo
        // consulta.derivacion_pediatria // esto nunca existio !!!!!!!!!!
        // todavia falta......
        consulta.turno = capitalize(row['TURNO']);
        const consultaNueva = this.consultaORM.create(consulta);
        await this.consultaORM.save(consultaNueva);
        // consulta hija  lacreo y pongo clinica.consulta = consulta
        const clinica = new Clinica();
        // verificar nulos importante y verificar nulos no importante(estos los seteo como desactivados)
        clinica.consulta = consultaNueva;
        clinica.diabetes = !!row.DBT;
        clinica.hta = !!row.HTA;
        clinica.obesidad = !!row.O;
        clinica.consumo_alcohol = !!row['CP-OH'];
        clinica.consumo_drogas = !!row['CP-D'];
        clinica.consumo_tabaco = !!row['CP-TBQ'];
        clinica.antecedentes_perinatal = convertirSiNo(row['ANTECEDENTES PERINATALES Y DE  ENF. PREVIAS']);
        clinica.enfermedades_previas = convertirSiNo(row['ANTECEDENTES PERINATALES Y DE  ENF. PREVIAS']);
        clinica.vacunas = convertirVacunas(row.VACUNAS);
        clinica.peso = pasarAnumero(row['PESO (Kg)']);
        clinica.talla = pasarAnumero(row['TALLA (cm)']);
        clinica.pct = pasarAnumero(row['PCT (T/E)']);
        clinica.cc = pasarAnumero(row['CC(cm)']);
        clinica.pcimc = row.PCIMC;
        clinica.imc = pasarAnumero(row.IMC);
        clinica.tas = pasarAnumero(row.TAS);
        clinica.tad = pasarAnumero(row.TAD);
        clinica.pcta = pasarAnumero(row.PCTA);
        clinica.examen_visual = row['EX.VISUAL'];
        clinica.ortopedia_traumatologia = converitirTrauma(row['O Y T']);
        clinica.lenguaje = row.LENGUAJE;
        clinica.segto = convertirSiNo(row['SEGTO.']);
        clinica.alimentacion = convertirAlimentacion(row['ALIMENTACIÓN']);
        clinica.hidratacion = convertirHidratacion(capitalize(row['HIDRATACIÓN']));
        clinica.leche = convertirSiNo(row['TOMA LECHE']);
        clinica.infusiones = row['INFUSIÓN'] ? capitalize(row['INFUSIÓN']) : 'Otras';
        clinica.cantidad_comidas = convertirComidas(row['Nº COMIDAS AL DÍA']); // lo tengo que convertir
        clinica.horas_pantalla = convertirHorasPantalla(row['TIEMPO DEDICADO AL USO DE PANTALLAS DURANTE EL DÍA']); // convertir a lo que corresponde
        clinica.horas_juego_aire_libre = convertirHorasAireLibre(row['TIEMPO DE JUEGO AL AIRE LIBRE DURANTE EL DÍA']); // convertir a lo que corresponde
        clinica.horas_suenio = convertirHorasSuenio(row['HORAS DIARIAS DE SUEÑO']); // convertir a lo que corresponde
        clinica.estado_nutricional = row['ESTADO NUTRICIONAL'];
        clinica.tension_arterial = row['TA'];
        const clinicaNueva = this.clinicaORM.create(clinica);
        await this.clinicaORM.save(clinicaNueva);
        if (log) console.log(chico);
        if (log) console.log(consulta);
        if (log) console.log(clinica);
        log = false;
      } catch (error) {
        console.error(`Error al procesar la fila ${i + 1}:`, error.message);
        row.posicionExcel = i + 1;
        row.motivo = `Error: ${error.message}`;
        noCargados.push(row);
        continue;
      }
    }
    // verfico el dni
    console.log('TERMINO!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    return noCargados;
  }

  async procesarOdontologia(data) {
    console.log(data);
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      console.log(row['NOMBRE Y APELLIDO']);
    }
    return true;
  }

  async procesarFonoaudiologia(data: object) {
    console.log(console.log(data));
    return true;
  }

  async procesarOftalmologia(data: object) {
    console.log(console.log(data));
    return true;
  }

  // verificaciones
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
}

function pasarAnumero(value: any) {
  return +(!isNaN(parseFloat(value)) && isFinite(value) ? parseFloat(value) : 0);
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

function capitalize(str) {
  if (!str) return 'No hay dato';
  return str
    .toLocaleLowerCase()
    .split(' ')
    .map(function (word, index) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

function separarNombre(apellidoYnombre: string) {
  if (!apellidoYnombre) {
    return ['NO DEFINIDO', 'NO DEFINIDO']; // Devuelve un arreglo vacío si la cadena es null o undefined
  }
  return apellidoYnombre.trim().split(/\s+/);
}

function convertirVacunas(param: string): any {
  const conversiones: { [key: string]: any } = {
    COMPLETO: 'Completo',
    INCOMPLETO: 'Incompleto',
    'SE DESCONOCE': 'Desconocido',
  };

  return conversiones[param] ?? null;
}
function converitirTrauma(param: string): any {
  const conversiones: { [key: string]: any } = {
    Normal: 'Normal',
    Escoliosis: 'Escoliosis',
    'Pie Plano': 'Pie Plano',
  };

  return conversiones[param] ?? 'Otras';
}

function convertirHidratacion(params: any) {
  const conversiones: { [key: string]: string } = {
    Si: 'Agua',
  };

  return conversiones[params] || params;
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
function convertirBarrios(barrio: string): string {
  if (typeof barrio == 'object') {
    const date = new Date(barrio);
    const opciones: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };
    barrio = date.toLocaleDateString('es-ES', opciones);
  }
  if (barrio) barrio = barrio.replace('bº', '').replace('Bº', '').replace('b°', '').replace('B°', '').replace('Barrio', '').replace('barrio', '').trim();
  const conversiones: { [key: string]: string } = {
    // esto alcanza solo para el archivo de clinica
    'Anahi Mapu': 'Anahi Mapu',
    obrero: 'Obrero A',
    'obrero a': 'Obrero A',
    '20de Febrero': '20 de Febrero',
    'Anai Mapu': 'Anahi Mapu',
    'Anai mapu': 'Anahi Mapu',
    'anai mapu': 'Anahi Mapu',
    'anai Mapu': 'Anahi Mapu',
    'Barrio las Cabañitas': 'Las Cabañitas',
    'barrio 10 de febrero': '10 de febrero',
    'Barrio Nuevo': 'Nuevo',
    'La alameda': 'La Alameda',
    'Colonia Santa Elena': 'Santa Elena',
    'Barrio nuevo': 'Nuevo',
    '10 de ferbrero': '10 de febrero',
    '10 de Febrero': '10 de febrero',
    'Antartida argentina': 'Antartida Argentina',
    '02 de Feebrero': '2 de Febrero',
    '2 de Febrero': '2 de Febrero',
    '10 de FEBRERO': '10 de Febrero',
    '10 FEBRERO': '10 de febrero',
    '2 de febrero': '2 de Febrero',
    'Nuevo Ferri': 'Ferri',
    Obrero: 'Obrero A',
    'Anai  Mapu': 'Anahi Mapu',
    '2 cde febrero': '2 de Febrero',
    '2 e febrero': '2 de Febrero',
    '2 e Febrero': '2 de Febrero',
    'colonia Santa Elena': 'Santa Elena',
    '130 viv': '130 Viviendas',
    'obrero A': 'Obrero A',
    'obreo A': 'Obrero A',
    Antartida: 'Antartida Argentina',
    'antartida argentina': 'Antartida Argentina',
    'La Esperanza': 'Nueva Esperanza',
    'La esperanza': 'Nueva Esperanza',
    'nueva Esperanza': 'Nueva Esperanza',
    'nueva esperanza': 'Nueva Esperanza',
    'Antàrtida Argentina': 'Antartida Argentina',
    villarino: 'Villarino',
    'Anatrtida Argentina': 'Antartida Argentina',
    'luis piedrabuena': 'Luis Piedra Buena',
    'las Cabañitas': 'Las Cabañitas',
    nuevo: 'Nuevo',
    // '7mo Grado': 'Septimo Grado',
  };
  return conversiones[barrio] || barrio;
}
function convertirAlimentacion(param: string) {
  const conversiones: { [key: string]: any } = {
    // '': 'Mixta y variada',
    // '': 'Rica en HdC',
    'Pobre en Fibras': 'Pobre en fibras',
    // '': 'Fiambres',
    // '': 'Frituras',
  };

  return conversiones[param] || param;
}
function convertirSiNo(value: string | null) {
  if (!value) return false;
  return value.toLocaleLowerCase() == 'si';
}
function convertirComidas(params: string) {
  //  Clinica.cantidad_comidas: "Picoteo" | "Mayor a 4" | "4" | "Menor a 4"
  const conversiones: { [key: string]: any } = {
    '>4': 'Mayor a 4',
    '4': '4',
    '<4': 'Menor a 4',
    Picoteo: 'Picoteo',
  };

  return conversiones[params] ?? 'Menor a 4';
}
function convertirHorasPantalla(params: string) {
  //  "Menor a 2hs" | "Entre 2hs y 4hs" | "Más de 6hs"
  const conversiones: { [key: string]: any } = {
    '>2h': 'Menor a 2hs',
    '2h a 4h': 'Entre 2hs y 4hs',
    '>6h': 'Más de 6hs',
  };

  return conversiones[params] ?? 'Menor a 2hs'; // esto es el caso nulo, tendria que mandarlo null y que no lo cargue?;
}
function convertirHorasAireLibre(params: string) {
  //   "Menos de 1h" | "1h" | "Más de 1h"
  const conversiones: { [key: string]: any } = {
    '>1h': 'Más de 1h',
    '1h': '1h',
    '<1h': 'Menos de 1h',
    Picoteo: 'Picoteo',
  };

  return conversiones[params] ?? 'Menos de 1h'; // esto es el caso nulo, tendria que mandarlo null y que no lo cargue?
}
function convertirHorasSuenio(params: string) {
  //  Clinica.horas_suenio: "Menos de 10hs" | "Entre 10hs y 12hs" | "Más de 13hs"
  const conversiones: { [key: string]: any } = {
    '>13': 'Más de 13hs',
    '10h a 12h': 'Entre 10hs y 12hs',
    '<10': 'Menos de 10hs',
    Picoteo: 'Picoteo',
  };

  return conversiones[params] ?? 'Menos de 10hs'; // esto es el caso nulo, tendria que mandarlo null y que no lo cargue?
}
