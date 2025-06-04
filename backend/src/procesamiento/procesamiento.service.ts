import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Chico } from 'src/chico/entities/chico.entity';
import { Curso } from 'src/curso/entities/curso.entity';
import { Institucion } from 'src/institucion/entities/institucion.entity';
import { Fonoaudiologia } from 'src/consulta/entities/fonoaudiologia.entity';
import { Oftalmologia } from 'src/consulta/entities/oftalmologia.entity';
import { Odontologia } from 'src/consulta/entities/odontologia.entity';
import { Clinica } from 'src/consulta/entities/clinica.entity';
import { Consulta } from 'src/consulta/entities/consulta.entity';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { Barrio } from 'src/barrio/entities/barrio.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { clasificacionDental } from '../consulta/consulta.service';
import { Prevencion } from 'src/consulta/entities/prevencion.entity';
import { Social } from 'src/consulta/entities/social.entity';

import { Taller } from 'src/taller/entities/taller.entity';
import { Marco } from 'src/marco/entities/marco.entity';
import { Especialidad } from 'src/especialidad/entities/especialidad.entity';
import { Categoria } from 'src/categoria/entities/categoria.entity';
import { Localidad } from 'src/localidad/entities/localidad.entity';
import { faker } from '@faker-js/faker/locale/es';

@Injectable()
export class ProcesamientoService {
  constructor(
    @InjectRepository(Consulta) private readonly consultaORM: Repository<Consulta>,
    @InjectRepository(Clinica) private readonly clinicaORM: Repository<Clinica>,
    @InjectRepository(Odontologia) private readonly odontologiaORM: Repository<Odontologia>,
    @InjectRepository(Oftalmologia) private readonly oftalmologiaORM: Repository<Oftalmologia>,
    @InjectRepository(Fonoaudiologia) private readonly fonoaudiologiaORM: Repository<Fonoaudiologia>,
    // chico,institucion, curso
    @InjectRepository(Especialidad) private readonly especialidadORM: Repository<Especialidad>,
    @InjectRepository(Institucion) private readonly institucionORM: Repository<Institucion>,
    @InjectRepository(Marco) private readonly marcoORM: Repository<Marco>,
    @InjectRepository(Curso) private readonly cursoORM: Repository<Curso>,
    @InjectRepository(Barrio) private readonly barrioORM: Repository<Barrio>,
    @InjectRepository(Chico) private readonly chicoORM: Repository<Chico>,
    @InjectRepository(Categoria) private readonly categoriaORM: Repository<Categoria>,
    @InjectRepository(Localidad) private readonly localidadORM: Repository<Localidad>,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}
  // se va a ir
  delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async procesarClinica(data: any, usuario: Usuario) {
    // const institucionCargadas = await this.institucionORM.find();
    // const cursosCargados = await this.cursoORM.find();
    const noCargados = [];
    for (let i = 0; i < data.length; i++) {
      const queryRunner = this.dataSource.createQueryRunner(); // Crear un QueryRunner para manejar la transacción
      await queryRunner.connect(); // Conectar el QueryRunner a la base de datos
      await queryRunner.startTransaction(); // Iniciar la transacción
      const row = data[i];
      try {
        const chico = await this.procesarChico(row, queryRunner);
        const consulta = new Consulta();
        consulta.chico = chico;
        consulta.created_at = new Date(row['FECHA']);
        consulta.curso = await this.verificarCurso(convertirCurso(row['SALA/GRADO']));
        consulta.edad = calcularEdad(new Date(row['FECHA DE NACIMIENTO']), consulta.created_at);
        // consulta.edad = row.EDAD //pero hay que trabajar el dato
        consulta.institucion = await this.verificarInstitucion(convertirInstitucion(row['INSTITUCIÓN'] || row['INSTITUCION']));
        consulta.obra_social = convertirSiNo(row['OBRA SOCIAL']);
        consulta.type = 'Clinica';
        consulta.usuario = usuario;
        consulta.turno = capitalize(row['TURNO']);
        consulta.observaciones = row['OBSERVACIONES'];
        consulta.derivacion_externa = false;
        consulta.derivacion_fonoaudiologia = convertirSiNo(row['FONOAUDIOLOGÍA']);
        consulta.derivacion_odontologia = false;
        consulta.derivacion_oftalmologia = convertirSiNo(row['OFTALMOLOGÍA']);
        consulta.derivacion_social = convertirSiNo(row['TRABAJO SOCIAL']);
        // consulta.derivacion_trabajoSocial // esto nose que onda hay que desarrollarlo
        // consulta.derivacion_pediatria // esto nunca existio !!!!!!!!!!
        const consultaNueva = queryRunner.manager.create(Consulta, consulta);
        await queryRunner.manager.save(consultaNueva);
        // const consultaNueva = this.consultaORM.create(consulta);
        // await this.consultaORM.save(consultaNueva);
        // consulta hija  lacreo y pongo clinica.consulta = consulta
        const clinica = new Clinica();
        // verificar nulos importante y verificar nulos no importante(estos los seteo como desactivados)
        const esClinica = this.obtenerTipoConsulta(row);

        clinica.es_clinica = esClinica;
        clinica.consulta = consultaNueva;
        clinica.peso = pasarAnumero(row['PESO (Kg)']);
        clinica.talla = pasarAnumero(row['TALLA (cm)']);
        clinica.pct = pasarAnumero(row['PCT (T/E)']);
        clinica.cc = pasarAnumero(row['CC(cm)']);
        clinica.imc = pasarAnumero(row.IMC);
        clinica.pcimc = row.PCIMC;
        clinica.segto = convertirSiNo(row['SEGTO.']);
        clinica.estado_nutricional = row['ESTADO NUTRICIONAL'];

        if (esClinica) {
          //clinica.consulta = consultaNueva;
          clinica.diabetes = !!row.DBT;
          clinica.hta = !!row.HTA;
          clinica.obesidad = !!row.O;
          clinica.consumo_alcohol = !!row['CP-OH'];
          clinica.consumo_drogas = !!row['CP-D'];
          clinica.consumo_tabaco = !!row['CP-TBQ'];
          clinica.antecedentes_perinatal = convertirSiNo(row['ANTECEDENTES PERINATALES Y DE  ENF. PREVIAS']);
          clinica.enfermedades_previas = convertirSiNo(row['ANTECEDENTES PERINATALES Y DE  ENF. PREVIAS']);
          clinica.vacunas = convertirVacunas(row.VACUNAS) === null || convertirVacunas(row.VACUNAS) === undefined ? 'Desconocido' : convertirVacunas(row.VACUNAS);
          // clinica.peso = pasarAnumero(row['PESO (Kg)']);
          // clinica.talla = pasarAnumero(row['TALLA (cm)']);
          // clinica.pct = pasarAnumero(row['PCT (T/E)']);
          // clinica.cc = pasarAnumero(row['CC(cm)']);
          // clinica.pcimc = row.PCIMC;
          // clinica.imc = pasarAnumero(row.IMC);

          // NO ES LA MEJOR SOLUCION:

          clinica.tas = pasarAnumero(row.TAS) === 0 ? 1 : pasarAnumero(row.TAS);
          clinica.tad = pasarAnumero(row.TAD) === 0 ? 1 : pasarAnumero(row.TAD);
          clinica.pcta = pasarAnumero(row.PCTA) === 0 ? 1 : pasarAnumero(row.PCTA);
          clinica.examen_visual = row['EX.VISUAL'] ?? 'Desconocido';
          clinica.ortopedia_traumatologia = converitirTrauma(row['O Y T']);
          if (row.LENGUAJE) {
            clinica.lenguaje = row.LENGUAJE;
          } else {
            throw new Error('No se envio el lenguaje');
          }
          // clinica.segto = convertirSiNo(row['SEGTO.']);
          if (row['ALIMENTACIÓN']) {
            clinica.alimentacion = convertirAlimentacion(row['ALIMENTACIÓN']);
          } else {
            throw new Error('No se envio la alimentacion');
          }
          clinica.hidratacion = convertirHidratacion(capitalize(row['HIDRATACIÓN']));
          clinica.leche = convertirSiNo(row['TOMA LECHE']);
          clinica.infusiones = row['INFUSIÓN'] ? capitalize(row['INFUSIÓN']) : 'Otras';
          clinica.cantidad_comidas = convertirComidas(row['Nº COMIDAS AL DÍA']); // lo tengo que convertir
          clinica.horas_pantalla = convertirHorasPantalla(row['TIEMPO DEDICADO AL USO DE PANTALLAS DURANTE EL DÍA']); // convertir a lo que corresponde
          clinica.horas_juego_aire_libre = convertirHorasAireLibre(row['TIEMPO DE JUEGO AL AIRE LIBRE DURANTE EL DÍA']); // convertir a lo que corresponde
          clinica.horas_suenio = convertirHorasSuenio(row['HORAS DIARIAS DE SUEÑO']); // convertir a lo que corresponde
          // clinica.estado_nutricional = row['ESTADO NUTRICIONAL'];
          clinica.tension_arterial = row['TA'];
        } else {
          clinica.tension_arterial = null;
          clinica.tas = null;
          clinica.tad = null;
          clinica.pcta = null;
        }
        const clinicaNueva = queryRunner.manager.create(Clinica, clinica);
        await queryRunner.manager.save(clinicaNueva);
        // const clinicaNueva = this.clinicaORM.create(clinica);
        // await this.clinicaORM.save(clinicaNueva);
        // Confirmar la transacción de esta iteración
        await queryRunner.commitTransaction();
      } catch (error) {
        console.error(`Error al procesar la fila ${i + 1}:`, error.message);
        row.posicionExcel = i + 1;
        row.motivo = `Error: ${error.message}`;
        noCargados.push(row);
        await queryRunner.rollbackTransaction();
        continue;
      } finally {
        await queryRunner.release();
      }
    }
    return noCargados;
  }

  obtenerTipoConsulta(row) {
    let esClinica;

    if (
      // Campos que pertenecen a Clinica
      row.VACUNAS === null &&
      row['EX.VISUAL'] === null &&
      row['O Y T'] === null &&
      row.LENGUAJE === null &&
      row['ALIMENTACIÓN'] === null &&
      row['INFUSIÓN'] === null &&
      row['Nº COMIDAS AL DÍA'] === null &&
      row['TIEMPO DEDICADO AL USO DE PANTALLAS DURANTE EL DÍA'] === null &&
      row['TIEMPO DE JUEGO AL AIRE LIBRE DURANTE EL DÍA'] === null &&
      row['HORAS DIARIAS DE SUEÑO'] === null &&
      row['HIDRATACIÓN'] === null &&
      row.DBT === null &&
      row.HTA === null &&
      row.O === null &&
      row['CP-OH'] === null &&
      row['CP-D'] === null &&
      row['CP-TBQ'] === null &&
      row['ANTECEDENTES PERINATALES Y DE  ENF. PREVIAS'] === null &&
      row['TOMA LECHE'] === null &&
      // Campos que no deberian estar en nutricion, luego se setean en nulo
      // Estan aca porque estos campos estan siempre en el excel
      row['TA'] !== null &&
      row.TAS !== null &&
      row.TAD !== null &&
      row.PCTA !== null &&
      // campos obligatorios de nutricion
      row['PESO (Kg)'] !== null &&
      row['TALLA (cm)'] !== null &&
      row['PCT (T/E)'] !== null &&
      row['CC(cm)'] !== null &&
      row.IMC !== null &&
      row.PCIMC !== null &&
      row['ESTADO NUTRICIONAL'] !== null &&
      row['SEGTO.'] !== null
    ) {
      esClinica = false;
    } else {
      esClinica = true;
    }
    return esClinica;
  }

  async procesarOdontologia(data, usuario) {
    const noCargados = [];
    for (let i = 0; i < data.length; i++) {
      const queryRunner = this.dataSource.createQueryRunner(); // Crear un QueryRunner para manejar la transacción
      await queryRunner.connect(); // Conectar el QueryRunner a la base de datos
      await queryRunner.startTransaction(); // Iniciar la transacción
      const row = data[i];
      try {
        const chico = await this.procesarChico(row, queryRunner);
        const consulta = new Consulta();
        consulta.chico = chico;
        consulta.created_at = new Date(row['FECHA']);
        consulta.curso = await this.verificarCurso(convertirCurso(row['SALA/GRADO']));
        consulta.edad = calcularEdad(new Date(row['FECHA DE NACIMIENTO']), consulta.created_at);
        // consulta.edad = row.EDAD //pero hay que trabajar el dato
        consulta.institucion = await this.verificarInstitucion(convertirInstitucion(row['ESTABLECIMIENTO ESCOLAR']));
        consulta.obra_social = convertirSiNo(row['OBRA SOCIAL']);
        consulta.type = 'Odontologia';
        consulta.observaciones = row['OBSERVACIONES'];
        consulta.turno = capitalize(row['TURNO']);
        consulta.usuario = usuario;
        consulta.derivacion_externa = row['DERIVACIÓN'] === 1 ? true : false;
        const consultaNueva = queryRunner.manager.create(Consulta, consulta);
        await queryRunner.manager.save(consultaNueva);
        // const consultaNueva = this.consultaORM.create(consulta);
        // await this.consultaORM.save(consultaNueva);
        const odontologia = new Odontologia();
        odontologia.consulta = consultaNueva;
        odontologia.primera_vez = !!row['1RA VEZ'];
        odontologia.ulterior = !!row['ULTERIOR'];

        if (row['TOTAL PERMANENTES'] !== null && row['TOTAL PERMANENTES'] !== undefined) {
          odontologia.dientes_permanentes = row['TOTAL PERMANENTES'];
        } else {
          throw new Error('Falta dientes_permanentes');
        }
        if (row['TOTAL TEMPORARIOS'] !== null && row['TOTAL TEMPORARIOS'] !== undefined) {
          odontologia.dientes_temporales = row['TOTAL TEMPORARIOS'];
        } else {
          throw new Error('Falta dientes_temporales');
        }

        odontologia.sellador = row['SELLADOR'] === null || row['SELLADOR'] === undefined ? 0 : row['SELLADOR'];
        odontologia.topificacion = !!row['TOPICACION'];
        odontologia.cant_cepillado = 0;

        if (row['DIENTE RECUPERABLE'] !== null && row['DIENTE RECUPERABLE'] !== undefined) {
          odontologia.dientes_recuperables = row['DIENTE RECUPERABLE'];
        } else {
          throw new Error('Falta dientes_recuperables');
        }
        if (row['DIENTE NO RECUPERABLE'] !== null && row['DIENTE NO RECUPERABLE'] !== undefined) {
          odontologia.dientes_irecuperables = row['DIENTE NO RECUPERABLE'];
        } else {
          throw new Error('Falta dientes_irecuperables');
        }

        odontologia.cepillo = !!row['CEPILLO'];
        odontologia.habitos = row['HÁBITOS'];
        odontologia.clasificacion = clasificacionDental(odontologia.dientes_recuperables, odontologia.dientes_irecuperables); //row['CLASIFICACIÓN'];
        // const odontologiaNueva = this.odontologiaORM.create(odontologia);
        // await this.odontologiaORM.save(odontologiaNueva);
        const odontologiaNueva = queryRunner.manager.create(Odontologia, odontologia);
        await queryRunner.manager.save(odontologiaNueva);
        await queryRunner.commitTransaction();
      } catch (error) {
        console.error(`Error al procesar la fila ${i + 1}:`, error.message);
        row.posicionExcel = i + 1;
        row.motivo = `Error: ${error.message}`;
        noCargados.push(row);
        await queryRunner.rollbackTransaction();
        continue;
      } finally {
        await queryRunner.release();
      }
    }
    return noCargados;
  }

  async procesarFonoaudiologia(data, usuario) {
    const noCargados = [];
    for (let i = 0; i < data.length; i++) {
      const queryRunner = this.dataSource.createQueryRunner(); // Crear un QueryRunner para manejar la transacción
      await queryRunner.connect(); // Conectar el QueryRunner a la base de datos
      await queryRunner.startTransaction(); // Iniciar la transacción
      const row = data[i];
      try {
        if (row.DNI) {
          const chico = await this.procesarChico(row, queryRunner, true);
          //  const chico = await this.chicoORM.findOneBy({ dni: row.DNI });
          if (chico !== null) {
            const consulta = new Consulta();
            consulta.chico = chico;
            consulta.created_at = new Date(row['FECHA']);
            const curso = await this.verificarCurso(convertirCurso(row['SALA/GRADO']));
            if (curso === null || curso === undefined) {
              throw new Error('No se envio curso');
            } else {
              consulta.curso = curso;
            }
            // consulta.edad = calcularEdad(new Date(row['FECHA DE NACIMIENTO']), consulta.created_at);
            consulta.edad = typeof row.EDAD == 'number' ? row.EDAD : 0; //pero hay que trabajar el dato
            const institucion = await this.verificarInstitucion(convertirInstitucion(row['ESTABLECIMIENTO ESCOLAR']));
            if (institucion === null || institucion === undefined) {
              throw new Error('No se envio Institucion');
            } else {
              consulta.institucion = institucion;
            }
            consulta.obra_social = convertirSiNo(row['OBRA SOCIAL']);
            consulta.type = 'Fonoaudiologia';
            consulta.observaciones = row['OBSERVACIÓN'];
            consulta.derivacion_externa = convertirSiNo(row['DERIVACIÓN']);
            consulta.usuario = usuario;
            consulta.turno = capitalize(row['TURNO']) == 'No hay dato' ? 'Tarde' : capitalize(row['TURNO']);
            const consultaNueva = queryRunner.manager.create(Consulta, consulta);
            await queryRunner.manager.save(consultaNueva);
            // const consultaNueva = this.consultaORM.create(consulta);
            // await this.consultaORM.save(consultaNueva);
            const fonoaudiologia = new Fonoaudiologia();
            fonoaudiologia.consulta = consultaNueva;
            fonoaudiologia.asistencia = convertirSiNo(row['ASISTENCIA']);
            fonoaudiologia.causas = row['CAUSAS'] ?? 'Otras';
            fonoaudiologia.diagnostico_presuntivo = convertirDiagnostico(row['DIAGNÓSTICO PRESUNTIVO']);
            // const fonoaudiologiaNueva = await this.fonoaudiologiaORM.create(fonoaudiologia);
            // await this.fonoaudiologiaORM.save(fonoaudiologiaNueva);
            const fonoaudiologiaNueva = queryRunner.manager.create(Fonoaudiologia, fonoaudiologia);
            await queryRunner.manager.save(fonoaudiologiaNueva);
            await queryRunner.commitTransaction();
          } else {
            throw new Error('No hay chico cargado con ese DNI. Cargarlo antes.');
          }
        } else {
          throw new Error('No se envio el DNI');
        }
      } catch (error) {
        console.error(`Error al procesar la fila ${i + 1}:`, error.message);
        row.posicionExcel = i + 1;
        row.motivo = `Error: ${error.message}`;
        noCargados.push(row);
        await queryRunner.rollbackTransaction();
        continue;
      } finally {
        await queryRunner.release();
      }
    }
    return noCargados;
  }

  async procesarOftalmologia(data, usuario) {
    const noCargados = [];
    for (let i = 0; i < data.length; i++) {
      const queryRunner = this.dataSource.createQueryRunner(); // Crear un QueryRunner para manejar la transacción
      await queryRunner.connect(); // Conectar el QueryRunner a la base de datos
      await queryRunner.startTransaction(); // Iniciar la transacción
      const row = data[i];
      try {
        const chico = await this.procesarChico(row, queryRunner);
        const consulta = new Consulta();
        consulta.chico = chico;
        consulta.created_at = new Date(row['FECHA']);
        consulta.curso = await this.verificarCurso(convertirCurso(row['SALA/GRADO']));
        consulta.edad = calcularEdad(new Date(row['FECHA DE NACIMIENTO']), consulta.created_at);
        // consulta.edad = row.EDAD //pero hay que trabajar el dato
        consulta.institucion = await this.verificarInstitucion(convertirInstitucion(row['ESTABLECIMIENTO ESCOLAR']));
        consulta.obra_social = convertirSiNo(row['OBRA SOCIAL']);
        consulta.type = 'Oftalmologia';
        consulta.observaciones = row['OBSERVACIONES'];
        consulta.derivacion_externa = convertirSiNo(row['DERIVACIÓN']);
        consulta.usuario = usuario;
        consulta.turno = capitalize(row['TURNO']);
        // const consultaNueva = this.consultaORM.create(consulta);
        // await this.consultaORM.save(consultaNueva);
        const consultaNueva = queryRunner.manager.create(Consulta, consulta);
        await queryRunner.manager.save(consultaNueva);
        // consulta hija  lacreo y pongo clinica.consulta = consulta
        const oftalmologia = new Oftalmologia();
        oftalmologia.consulta = consultaNueva;
        oftalmologia.anteojos = !!row['ANTEOJOS'];
        oftalmologia.control = !!row['CONTROL'];
        oftalmologia.demanda = row['DEMANDA'] ?? 'Otro';
        oftalmologia.primera_vez = !!row['1RA VEZ'];
        oftalmologia.prox_control = calcularProximoControl(row['PROX. CONTROL'], consulta.created_at);
        oftalmologia.receta = !!row['RECETA'];

        const oftalmologiaNueva = queryRunner.manager.create(Oftalmologia, oftalmologia);
        await queryRunner.manager.save(oftalmologiaNueva);
        await queryRunner.commitTransaction();
      } catch (error) {
        console.error(`Error al procesar la fila ${i + 1}:`, error.message);
        row.posicionExcel = i + 1;
        row.motivo = `Error: ${error.message}`;
        noCargados.push(row);
        await queryRunner.rollbackTransaction();
        continue;
      } finally {
        await queryRunner.release();
      }
    }
    // verfico el dni
    return noCargados;
  }

  async procesarPrevencion(data, usuario) {
    const noCargados = [];
    for (let i = 0; i < data.length; i++) {
      const queryRunner = this.dataSource.createQueryRunner(); // Crear un QueryRunner para manejar la transacción
      await queryRunner.connect(); // Conectar el QueryRunner a la base de datos
      await queryRunner.startTransaction(); // Iniciar la transacción
      const row = data[i];
      try {
        if (row.DNI) {
          const chico = await this.procesarChico(row, queryRunner, true);
          // const chico = await this.chicoORM.findOneBy({ dni: row.DNI });
          if (chico !== null) {
            const consulta = new Consulta();
            consulta.chico = chico;
            consulta.usuario = usuario;

            consulta.created_at = new Date(row['FECHA']);
            consulta.curso = await this.verificarCurso(convertirCurso(row['GRADO']));
            consulta.edad = calcularEdad(chico.fe_nacimiento, consulta.created_at);
            const institucion = await this.institucionORM.findOneBy({ nombre: 'Esc. N°294' });
            consulta.institucion = institucion;
            consulta.obra_social = convertirSiNo(row['OBRA SOCIAL']);
            consulta.type = 'Prevencion';
            consulta.observaciones = row['OBSERVACIONES'];
            consulta.derivacion_externa = false;
            consulta.turno = capitalize(row['TURNO']) == 'No hay dato' ? 'Tarde' : capitalize(row['TURNO']);
            const consultaNueva = queryRunner.manager.create(Consulta, consulta);
            await queryRunner.manager.save(consultaNueva);
            // consulta hija  lacreo y pongo clinica.consulta = consulta
            const prevencion = new Prevencion();
            prevencion.consulta = consultaNueva;
            const otra_problematica = row['OTRAS PROBLEMÁTICAS'] === 'Depresión' ? 'Depresion' : row['OTRAS PROBLEMÁTICAS'];
            if (otra_problematica === null || otra_problematica === undefined) {
              throw new Error('No se envio otra_problematica');
            } else {
              prevencion.otra_problematica = otra_problematica;
            }
            prevencion.consumo_problematico = row['CONSUMO PROBLEMATICO'] ?? 'Otras';
            prevencion.edad_inicio_consumo = row['EDAD DE INICIO DE CONSUMO'];
            prevencion.frecuencia = convertirFrecuenciaConsumo(row['FRECUENCIA']);
            prevencion.motivo_consumo = row['MOTIVO DE CONSUMO'];

            const prevencionNueva = queryRunner.manager.create(Prevencion, prevencion);
            await queryRunner.manager.save(prevencionNueva);
            await queryRunner.commitTransaction();
          } else {
            throw new Error('No hay chico cargado con ese DNI. Cargarlo antes.');
          }
        } else {
          throw new Error('No se envio el DNI');
        }
      } catch (error) {
        console.error(`Error al procesar la fila ${i + 1}:`, error.message);
        row.posicionExcel = i + 1;
        row.motivo = `Error: ${error.message}`;
        noCargados.push(row);
        await queryRunner.rollbackTransaction();
        continue;
      } finally {
        await queryRunner.release();
      }
    }
    // verfico el dni
    return noCargados;
  }

  async procesarSocial(data, usuario) {
    const noCargados = [];
    for (let i = 0; i < data.length; i++) {
      const queryRunner = this.dataSource.createQueryRunner(); // Crear un QueryRunner para manejar la transacción
      await queryRunner.connect(); // Conectar el QueryRunner a la base de datos
      await queryRunner.startTransaction(); // Iniciar la transacción
      const row = data[i];
      try {
        if (row.DNI) {
          // const chico = await this.chicoORM.findOneBy({ dni: row.DNI });
          const chico = await this.procesarChico(row, queryRunner, true);
          if (chico !== null) {
            const consulta = new Consulta();
            consulta.chico = chico;
            consulta.usuario = usuario;
            const anio = Number(row.fecha);
            consulta.created_at = new Date(anio, 1, 2);
            const curso = await this.verificarCurso(convertirCurso(row['SALA/GRADO']));
            if (curso === null || curso === undefined) {
              throw new Error('No se envio curso');
            } else {
              consulta.curso = curso;
            }
            consulta.edad = calcularEdad(chico.fe_nacimiento, consulta.created_at);
            const institucion = await this.verificarInstitucion(convertirInstitucion(row['INSTITUCIÓN']));
            if (institucion === null || institucion === undefined) {
              throw new Error('No se envio institucion');
            } else {
              consulta.institucion = institucion;
            }
            consulta.obra_social = convertirSiNo(row['OBRA SOCIAL']);
            consulta.type = 'Social';
            consulta.observaciones = row['OBSERVACIONES'];
            consulta.derivacion_externa = false;
            consulta.turno = capitalize(row['TURNO']) == 'No hay dato' || capitalize(row['TURNO']) == 'Jornada Completa' ? 'Tarde' : capitalize(row['TURNO']);
            const consultaNueva = queryRunner.manager.create(Consulta, consulta);
            await queryRunner.manager.save(consultaNueva);
            // consulta hija  lacreo y pongo clinica.consulta = consulta
            const social = new Social();
            social.consulta = consultaNueva;
            social.categorias = await this.convertirCategorias(row['Categorias']);
            social.articulacion = row['Articulación con:'] === null ? 'No hay dato' : row['Articulación con:'];
            social.demanda = row['Demanda de:'] === null ? 'No hay dato' : row['Demanda de:'];
            social.objeto_informe = row['Objeto de Informe'] === null ? 'No hay dato' : row['Objeto de Informe'];
            social.seguimiento = row['Seguimiento'] === null ? 'No hay dato' : row['Seguimiento'];

            const socialNueva = queryRunner.manager.create(Social, social);
            await queryRunner.manager.save(socialNueva);
            await queryRunner.commitTransaction();
          } else {
            throw new Error('No hay chico cargado con ese DNI. Cargarlo antes.');
          }
        } else {
          throw new Error('No se envio el DNI');
        }
      } catch (error) {
        console.error(`Error al procesar la fila ${i + 1}:`, error.message);
        row.posicionExcel = i + 1;
        row.motivo = `Error: ${error.message}`;
        noCargados.push(row);
        await queryRunner.rollbackTransaction();
        continue;
      } finally {
        await queryRunner.release();
      }
    }
    // verfico el dni
    return noCargados;
  }

  async convertirCategorias(categorias): Promise<Categoria[]> {
    if (!categorias) return [];
    const arrayCategorias = categorias.split(',').map((cat) =>
      cat
        .trim()
        .toLowerCase()
        .replace(/(^|\s)([a-záéíóúüñ])/g, (match) => match.toUpperCase()),
    );

    const array = [];
    for (const cat of arrayCategorias) {
      array.push(await this.verificarCategoria(cat, false));
    }
    return array;
  }

  async verificarCategoria(categoria: string, insertar: boolean = false): Promise<null | Categoria> {
    //let institucionBd: any = this.institucionORM.findOneBy({ nombre: institucion });
    let categoriaBd = await this.categoriaORM.createQueryBuilder('categoria').where('categoria.nombre ILIKE :nombre', { nombre: categoria }).getOne();
    if (!categoriaBd && insertar) {
      categoriaBd = this.categoriaORM.create({ nombre: categoria });
      await this.categoriaORM.save(categoriaBd);
    }
    if (!categoriaBd) {
      return null;
    }
    return categoriaBd;
  }
  // el mes viene en enero febrero
  devolverFecha(anio, mes) {
    const meses = {
      enero: 0,
      febrero: 1,
      marzo: 2,
      abril: 3,
      mayo: 4,
      junio: 5,
      julio: 6,
      agosto: 7,
      septiembre: 8,
      octubre: 9,
      noviembre: 10,
      diciembre: 11,
    };

    if (!meses.hasOwnProperty(mes.toLowerCase())) {
      throw new Error('Mes no válido');
    }

    return new Date(anio, meses[mes.toLowerCase()], 1); // Primer día del mes
  }

  // Ejemplo de uso:
  async procesarTalleres(data, usuario) {
    const noCargados = [];
    for (let i = 0; i < data.length; i++) {
      const queryRunner = this.dataSource.createQueryRunner(); // Crear un QueryRunner para manejar la transacción
      await queryRunner.connect(); // Conectar el QueryRunner a la base de datos
      await queryRunner.startTransaction(); // Iniciar la transacción
      const row = data[i];
      try {
        const taller = new Taller();
        if (row['MARCO']) {
          taller.marco = await this.verificarMarco(row['MARCO'], row['ESPECIALIDAD']); // !!!!!! REVISAR
        } else {
          throw new Error('No se envio el marco');
        }
        taller.especialidad = await this.especialidadORM.findOneBy({ nombre: 'Prevencion' }); // !!!!!! REVISAR
        taller.cant_encuentros = row['CANT ENCUENTROS'] || row['ENCUENTROS'];
        // taller.fecha = row['FECHA DE REALIZACIÓN'] === undefined && row['FECHA '] === undefined ? this.devolverFecha(row['AÑO'], row['MES']) : row['FECHA DE REALIZACIÓN'] || row['FECHA '];
        taller.fecha = row['FECHA DE REALIZACIÓN'];
        taller.cant_participantes = row['CANT. DE PARTICIPANTES'] || row['Nº DE ASISTENTES'] || row['ASISTENTES'] || row['Nº de ASISTENTES'];
        taller.es_taller = row['TALLER'] ? convertirSiNo(row['TALLER']) : convertirSiNo(row['ES TALLER?']);
        taller.conjunto_con = row['EN CONJUNTO CON'] ?? 'Otros';
        taller.destinatarios = verificarDestinatarios(row['DESTINATARIOS']);
        taller.duracion = row['DURACION (HS)'] ?? 0; // !!!!!! casi ninguno tiene el dato. USO 0 SI NO ESTA, NO SE USA EN GRAFICOS NO ES TAN IMPORTANTE
        taller.entrega_cepillos = false; // Es false porque solo importo de prevencion
        taller.frecuencia = verificarFrecuencia(row['FRECUENCIA']); // no viene en todos. ESTA EN EL MAS GRANDE
        taller.curso = await this.verificarCurso(convertirCurso(row['SALA/GRADO']));
        if (row['INSTITUCIÓN'] || row['INSTITUCION']) {
          taller.institucion = await this.verificarInstitucion(convertirInstitucion(row['INSTITUCIÓN'] || row['INSTITUCION']));
        } else {
          throw new Error('No hay institucion');
        }
        taller.created_at = new Date();
        taller.nombre = (row['NOMBRE'] || row['NOMBRE TALLER'] || row['TALLER/TEMAS desplegable']) ?? 'No definido';
        taller.observaciones = row['OBSERVACIONES'];
        taller.recursos = row['RECURSOS'] ?? 'No hay dato';
        taller.turno = verificarTurno(row['TURNO']);
        const consultaNueva = queryRunner.manager.create(Taller, taller);
        await queryRunner.manager.save(consultaNueva);
        await queryRunner.commitTransaction();
      } catch (error) {
        console.error(`Error al procesar la fila ${i + 1}:`, error.message);
        row.posicionExcel = i + 1;
        row.motivo = `Error: ${error.message}`;
        noCargados.push(row);
        await queryRunner.rollbackTransaction();
        continue;
      } finally {
        await queryRunner.release();
      }
    }
    // verfico el dni
    return noCargados;
  }
  // verificaciones
  async verificarBarrio(barrio: string, insertar: boolean = false): Promise<null | Barrio> {
    let barrioBd = await this.barrioORM.createQueryBuilder('barrio').where('barrio.nombre ILIKE :nombre', { nombre: barrio }).getOne();
    if (!barrioBd && insertar) {
      // const neuquen = await this.localidadORM.findOneBy({ id: 1 });
      barrioBd = this.barrioORM.create({ nombre: barrio /*, localidad: neuquen*/ }); // puede que le falte la localidad !!!!!!!!!!
      await this.barrioORM.save(barrioBd);
    }
    if (!barrioBd) {
      return null;
    }
    return barrioBd;
  }

  async verificarInstitucion(institucion: string, insertar: boolean = false): Promise<null | Institucion> {
    //let institucionBd: any = this.institucionORM.findOneBy({ nombre: institucion });
    let institucionBd = await this.institucionORM.createQueryBuilder('institucion').where('institucion.nombre ILIKE :nombre', { nombre: institucion }).getOne();
    if (!institucionBd && insertar) {
      institucionBd = this.institucionORM.create({ nombre: institucion, tipo: 'Primario' }); // lo pongo fijo, se puede cambiar!!!!!!!!!!
      await this.institucionORM.save(institucionBd);
    }
    if (!institucionBd) {
      return null;
    }
    return institucionBd;
  }

  async verificarMarco(marco: string, nombreEspecialidad, insertar: boolean = false): Promise<null | Marco> {
    // Cambie esto para que sea mas exacto y no cree marcos de mas
    let marcoBd = await this.marcoORM.createQueryBuilder('marco').where('marco.nombre ILIKE :nombre', { nombre: marco }).getOne();
    const especialidad = await this.especialidadORM.findOneBy({ nombre: nombreEspecialidad });
    if (!marcoBd && insertar && especialidad) {
      marcoBd = this.marcoORM.create({ nombre: marco, especialidad: especialidad }); // !!!!! REVISAR
      await this.marcoORM.save(marcoBd);
    }
    if (!marcoBd) {
      return null;
    }
    return marcoBd;
  }

  async verificarCurso(curso: string, insertar: boolean = false): Promise<null | Curso> {
    // Cambie esto para que sea mas exacto y no cree cursos de mas
    let cursoBd = await this.cursoORM.createQueryBuilder('curso').where('curso.nombre ILIKE :nombre', { nombre: curso }).getOne();
    if (!cursoBd && insertar) {
      cursoBd = this.cursoORM.create({ nombre: curso });
      await this.cursoORM.save(cursoBd);
    }
    if (!cursoBd) {
      return null;
    }
    return cursoBd;
  }

  async procesarChico(row: any, queryRunner: QueryRunner, inventarDatos: boolean = false): Promise<Chico> {
    if (!row.DNI) {
      throw new Error('Dni no enviado');
    }
    let chico = await this.chicoORM.findOneBy({ dni: row.DNI });
    if (!chico) {
      if (inventarDatos) {
        const arrayApyNo = separarNombre(row['NOMBRE Y APELLIDO'] || row['Nombre y Apellido'] || row['Apellido y Nombre']);
        // chico = new Chico();
        // const chicoFactory = this.factoryManager.get(Chico);
        const barrio = await this.barrioORM.findOne({ where: { id: 1 } });

        const chico = Object.assign(new Chico(), {
          dni: row['DNI'],
          fe_nacimiento: faker.date.between({
            from: '2006-01-01T00:00:00.000Z',
            to: '2017-01-01T00:00:00.000Z',
          }),
          nombre_padre: null,
          nombre_madre: null,
          direccion: 'No hay dato', // CAMBIADO
          telefono: 11111111, // CAMBIADO
          sexo: 'Masculino',
          nombre: arrayApyNo[1],
          apellido: arrayApyNo[0],
          created_at: new Date(),
          barrio,
          deshabilitado: false,
        });
        const chicoInv = queryRunner.manager.create(Chico, chico);
        await queryRunner.manager.save(chicoInv);
        return chicoInv;
      }
      chico = new Chico();
      chico.dni = row.DNI;
      const arrayApyNo = separarNombre(row['NOMBRE Y APELLIDO'] || row['Nombre y Apellido']);
      chico.nombre = arrayApyNo[1];
      chico.apellido = arrayApyNo[0];
      chico.created_at = new Date(row['FECHA']);
      chico.barrio = await this.verificarBarrio(convertirBarrios(row['BARRIO']), true);
      if (!chico.barrio) {
        throw new Error('Barrio no existente ni cargado por el sistema ' + row['BARRIO']);
      }
      chico.direccion = row['DIRECCIÓN'] ? (row['DIRECCIÓN'].trim() ?? 'No hay dato') : 'No hay dato';
      chico.fe_nacimiento = row['FECHA DE NACIMIENTO'];
      chico.nombre_madre = row['NOMBRE Y APELLIDO MADRE'];
      chico.nombre_padre = row['NOMBRE Y APELLIDO PADRE'];
      chico.sexo = capitalize(row['SEXO']);
      if (row['TELEFONO'] === 'no tiene' || row['TELÉFONO'] === 'no tiene' || row['TELEFONO'] === 'No tiene' || row['TELÉFONO'] === 'No tiene' || row['TELEFONO'] === null || row['TELÉFONO'] === null) {
        chico.telefono = '11111111';
      } else {
        chico.telefono = row['TELÉFONO'] || row['TELEFONO']; // !! Puede no ser un numero
      }
      // chico = this.chicoORM.create(chico);
      // await this.chicoORM.save(chico);
      chico = queryRunner.manager.create(Chico, chico);
      await queryRunner.manager.save(chico);
    }
    return chico;
  }
}

function pasarAnumero(value: any) {
  return +(!isNaN(parseFloat(value)) && isFinite(value) ? parseFloat(value) : 0);
}
function convertirFrecuenciaConsumo(frecuencia) {
  const equivalencias = {
    'Todos días': 'Todos los dias',
    '2 veces x sem': '2 veces por semana',
    '3 veces x sem': '3 veces por semana',
    'fines de semana': 'Fines de semana',
    esporádico: 'Esporádico',
  };

  return equivalencias[frecuencia] || 'Otro';
}
function calcularProximoControl(prox: any, created_at: any) {
  if (!prox || !created_at) {
    return null;
  }

  const meses = {
    '3 meses': 3,
    '6 meses': 6,
    '12 meses': 12,
    '1 mes y medio': 1.5,
    '2 meses': 2,
  };

  const cantidadMeses = meses[prox];
  if (cantidadMeses === undefined) {
    return null;
  }

  const fecha = new Date(created_at);
  fecha.setMonth(fecha.getMonth() + cantidadMeses);

  return fecha;
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
  let arrayNombres = apellidoYnombre.trim().replace(',', '').split(/\s+/);
  if (arrayNombres.length == 1) {
    arrayNombres.push('NO DEFINIDO');
  } else if (arrayNombres.length > 2) {
    arrayNombres = [`${arrayNombres.slice(0, -1).join(' ')}`, arrayNombres[arrayNombres.length - 1]];
  }

  return arrayNombres;
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
/**
 * sirve para las instituciones existentes en clinica convertirlas
 * @param inst
 * @returns
 */
function convertirInstitucion(inst: string): string {
  const conversiones: { [key: string]: string } = {
    'ESC. 294': 'Esc. N°294',
    'JARDIN 118': 'Jardin N° 118',
    'JARDIN 49': 'Jardín N° 49',
  };
  return conversiones[inst] || inst;
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
function convertirDiagnostico(diagnostico: string) {
  if (diagnostico) diagnostico = diagnostico.trim().toLocaleUpperCase();
  else diagnostico = 'Otras patologías que dificulten el lenguaje y la comunicación';
  const conversiones = {
    'ORTODONCIA: PROTUSION LINGUAL,PALADAR HENDIDO.': 'Ortodoncia: Protrusión lingual, paladar hendido',
    'RESPIRADOR BUCAL.': 'Respirador bucal',
    'RETRASO EN EL LENGUAJE. DISLALIAS FUNCIONALES.': 'Retraso en el lenguaje, dislalias funcionales',
    'OTRAS PATOLOGIAS QUE DIFICULTEN EL LENGUAJE Y LA COMUNICACIÓN.': 'Otras patologías que dificulten el lenguaje y la comunicación',
    TEL: 'TEL',
    TEA: 'TEA',
  };

  return conversiones[diagnostico] || diagnostico;
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
    '2 febrero': '2 de Febrero',
    '02 de Feebrero': '2 de Febrero',
    '2 de Febrero': '2 de Febrero',
    '2 de fefrero': '2 de Febrero',
    '10 de FEBRERO': '10 de Febrero',
    '10 FEBRERO': '10 de febrero',
    '2 de febrero': '2 de Febrero',
    'Nuevo Ferri': 'Ferri',
    Obrero: 'Obrero A',
    'Anai  Mapu': 'Anahi Mapu',
    '2 cde febrero': '2 de Febrero',
    '2 e febrero': '2 de Febrero',
    '2 e Febrero': '2 de Febrero',
    '2 de Febreo': '2 de Febrero',
    'Bº 2 febrero': '2 de Febrero',
    'B° 2 febrero': '2 de Febrero',
    '2 de Ferbrero': '2 de Febrero',
    'colonia Santa Elena': 'Santa Elena',
    '130 viv': '130 Viviendas',
    '130 viv.': '130 Viviendas',
    Chacras: 'Seccion chacras',
    'obrero A': 'Obrero A',
    'obreo A': 'Obrero A',
    Antartida: 'Antartida Argentina',
    'Antartida argrentina': 'Antartida Argentina',
    'antartida argentina': 'Antartida Argentina',
    'La Esperanza': 'Nueva Esperanza',
    'La esperanza': 'Nueva Esperanza',
    'nueva Esperanza': 'Nueva Esperanza',
    'Nueva esperanza': 'Nueva Esperanza',
    'nueva esperanza': 'Nueva Esperanza',
    'Antàrtida Argentina': 'Antartida Argentina',
    villarino: 'Villarino',
    'Anatrtida Argentina': 'Antartida Argentina',
    'luis piedrabuena': 'Luis Piedra Buena',
    'las Cabañitas': 'Las Cabañitas',
    'Las Cabañzitas': 'Las Cabañitas',
    nuevo: 'Nuevo',
    DVN: 'Dvn',
    'puente 83': 'Puente 83',
    'San Sebastian D': 'San Sebastian',
    'San Sebastian B': 'San Sebastian',
    'B° San Sebastian A': 'San Sebastian',
    'Bº San Sebastian A': 'San Sebastian',
    'SAn Sebastian': 'San Sebastian',
    'San Sebastian A': 'San Sebastian',
    'la esperanza': 'Nueva Esperanza',
    'Anai Mpau': 'Anahi Mapu',
    'Luis Piedrabuena': 'Luis Piedra Buena',
    'Don bosco': 'Don Bosco',
    'Luis Pierda Buena': 'Luis Piedra Buena',
    'parque industrial': 'Parque Industrial',
    'Parque industrial': 'Parque Industrial',
    'Ciudad de laPaz': 'Ciudad de la Paz',
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
function verificarDestinatarios(destinatario) {
  const equivalencias = {
    ALUMNOS: 'Alumnos',
    DOCENTES: 'Docentes',
    FAMILIAS: 'Familias',
  };

  return equivalencias[destinatario];
}
function verificarTurno(destinatario) {
  const equivalencias = {
    MAÑANA: 'Mañana',
    TARDE: 'Tarde',
    'M y T': 'M y T',
    JC: 'JC',
  };

  return equivalencias[destinatario];
}
function verificarFrecuencia(destinatario) {
  const equivalencias = {
    'UNICA VEZ': 'Única vez',
    DIARIA: 'Diaria',
    SEMANAL: 'Semanal',
    MENSUAL: 'Mensual',
  };

  return equivalencias[destinatario];
}
