import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Between, EntityManager, IsNull, Not, Raw, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateConsultaDto } from './dto/create-consulta.dto';
import { UpdateConsultaDto } from './dto/update-consulta.dto';
import { Consulta } from './entities/consulta.entity';

import { Fonoaudiologia } from './entities/fonoaudiologia.entity';
import { Oftalmologia } from './entities/oftalmologia.entity';
import { Clinica } from './entities/clinica.entity';
import { Odontologia } from './entities/odontologia.entity';

import { Usuario } from 'src/usuario/entities/usuario.entity';
import { Institucion } from 'src/institucion/entities/institucion.entity';
import { Curso } from 'src/curso/entities/curso.entity';
import { Chico } from 'src/chico/entities/chico.entity';

@Injectable()
export class ConsultaService {
  constructor(
    @InjectRepository(Consulta) private readonly consultaORM: Repository<Consulta>,
    @InjectRepository(Clinica) private readonly clinicaORM: Repository<Clinica>,
    @InjectRepository(Odontologia) private readonly odontologiaORM: Repository<Odontologia>,
    @InjectRepository(Oftalmologia) private readonly oftalmologiaORM: Repository<Oftalmologia>,
    @InjectRepository(Fonoaudiologia) private readonly fonoaudiologiaORM: Repository<Fonoaudiologia>,
    // chico,institucion, curso
    @InjectRepository(Institucion) private readonly institucionORM: Repository<Institucion>,
    @InjectRepository(Curso) private readonly cursoORM: Repository<Curso>,
    @InjectRepository(Chico) private readonly chicoORM: Repository<Chico>,
  ) {}

  async create(createConsultaDto: CreateConsultaDto, usuario: Usuario) {
    if (createConsultaDto.clinica && createConsultaDto.fonoaudiologia && createConsultaDto.oftalmologia && createConsultaDto.odontologia) {
      throw new NotFoundException('Fallo la carga. No se envio datos de ningun tipo de consulta.');
    }

    return await this.consultaORM.manager.transaction(async (manager: EntityManager) => {
      const { clinica, oftalmologia, odontologia, fonoaudiologia, ...consultaCreate } = createConsultaDto;
      const curso = await manager.findOne(Curso, { where: { id: consultaCreate.id_curso, deshabilitado: false } });
      if (!curso) throw new BadRequestException('El curso ingresado no existe');
      const institucion = await manager.findOne(Institucion, { where: { id: consultaCreate.id_institucion, deshabilitado: false } });
      if (!institucion) throw new BadRequestException('La institucion ingresada no existe');
      const chico = await manager.findOne(Chico, { where: { id: consultaCreate.id_chico, deshabilitado: false } });
      if (!chico) throw new BadRequestException('El chico ingresado no existe');
      const nuevaConsulta = manager.create(Consulta, { ...consultaCreate, usuario, chico, institucion, curso });
      const consultaGuardada = await manager.save(nuevaConsulta);
      if (!consultaGuardada) throw new BadRequestException('La carga de la consulta falló');

      let nuevaConsultaHija = null;
      let consultaHijaGuardada = null;

      if (clinica) {
        const imc = clinica.peso / ((clinica.talla / 100) * (clinica.talla / 100));
        const estado_nutricional = estadoNutricional(clinica.pcimc);
        const tension_arterial = tensionArterial(clinica.pcta);
        // cualquiera de las dos formas esta bien, nose cual es mejor!!!!! segun chat la del objeto por como se gestiona orm
        nuevaConsultaHija = manager.create(Clinica, { consulta: consultaGuardada, ...clinica, imc, estado_nutricional, tension_arterial });
        consultaHijaGuardada = await manager.save(nuevaConsultaHija);
      }

      if (fonoaudiologia) {
        nuevaConsultaHija = manager.create(Fonoaudiologia, { consulta: consultaGuardada, ...fonoaudiologia });
        consultaHijaGuardada = await manager.save(nuevaConsultaHija);
      }

      if (oftalmologia) {
        nuevaConsultaHija = manager.create(Oftalmologia, { consulta: consultaGuardada, ...oftalmologia });
        consultaHijaGuardada = await manager.save(nuevaConsultaHija);
      }

      if (odontologia) {
        const clasificacion = clasificacionDental(odontologia.dientes_recuperables, odontologia.dientes_irecuperables);
        nuevaConsultaHija = manager.create(Odontologia, { consulta: consultaGuardada, ...odontologia, clasificacion });
        consultaHijaGuardada = await manager.save(nuevaConsultaHija);
      }

      // Si no se creó ninguna consulta hija, lanzamos un error y se hace rollback
      if (!nuevaConsultaHija) {
        throw new BadRequestException('Fallo la carga de la consulta hija');
      }

      delete consultaHijaGuardada.consulta;
      delete consultaHijaGuardada.id_consulta;
      return { ...consultaGuardada, ...consultaHijaGuardada };
    });
  }

  async findOne(id: number) {
    const consulta = await this.consultaORM.findOne({ where: { id }, relations: ['chico', 'curso', 'institucion', 'usuario'] });
    if (!consulta) throw new NotFoundException(`Consulta con id ${id} no encontrada`);
    let consultaHija;
    switch (consulta.type) {
      case 'Clinica':
        consultaHija = await this.clinicaORM.findOne({ where: { id_consulta: id } });
        break;
      case 'Oftalmologia':
        consultaHija = await this.oftalmologiaORM.findOne({ where: { id_consulta: id } });
        break;
      case 'Fonoaudiologia':
        consultaHija = await this.fonoaudiologiaORM.findOne({ where: { id_consulta: id } });
        break;
      case 'Odontologia':
        consultaHija = await this.odontologiaORM.findOne({ where: { id_consulta: id } });
        break;
      default:
        throw new NotFoundException(`Consulta sin tipo especificado.`);
        break;
    }
    delete consultaHija.id_consulta;
    return { ...consulta, [consulta.type.toLowerCase()]: consultaHija };
  }

  async esPrimeraVez(id: number, tipoConsulta: any) {
    const chico = await this.chicoORM.findOneBy({ id, deshabilitado: false });
    if (!chico) throw new NotFoundException(`Chico con id ${id} no encontrado`);
    const consulta = await this.consultaORM.findOne({
      where: { chico: { id: id }, type: tipoConsulta, deshabilitado: false },
      relations: ['chico'],
    });
    if (consulta) return { primera_vez: false };
    else return { primera_vez: true };
  }

  async busquedaPersonalizada(data: any) {
    const consulta = this.prepararDataConsultaPersonalizada(data);
    let consultas: Consulta[];
    if (!consulta.generales) {
      consultas = await this.consultaORM.find({ relations: ['chico', 'institucion', 'curso', 'usuario'], where: { deshabilitado: false } });
    } else {
      consultas = await this.consultaORM.find({ relations: ['chico', 'institucion', 'curso', 'usuario'], where: consulta.generales });
    }
    if (data.consultasSeleccionadas) {
      const resultados = [];
      // De la forma en la que esta esto, si se seleccionan mas de 1 tipo de consulta, va a retornar mas data de la que se deberia mostrar
      if (data.consultasSeleccionadas.includes('Clinica')) {
        // Clinica
        if (consulta.especificas) {
          if (consulta.especificas.rangoTalla) {
            consulta.especificas = {
              ...consulta.especificas,
              talla: Between(consulta.especificas.rangoTalla.tallaMin, consulta.especificas.rangoTalla.tallaMax),
            };
            delete consulta.especificas.rangoTalla;
          }
          if (consulta.especificas.rangoCC) {
            consulta.especificas = {
              ...consulta.especificas,
              cc: Between(consulta.especificas.rangoCC.ccMin, consulta.especificas.rangoCC.ccMax),
            };
            delete consulta.especificas.rangoCC;
          }
          if (consulta.especificas.rangoPeso) {
            consulta.especificas = {
              ...consulta.especificas,
              peso: Between(consulta.especificas.rangoPeso.pesoMin, consulta.especificas.rangoPeso.pesoMax),
            };
            delete consulta.especificas.rangoPeso;
          }
          if (consulta.especificas.rangoPct) {
            consulta.especificas = {
              ...consulta.especificas,
              pct: Between(consulta.especificas.rangoPct.pctMin, consulta.especificas.rangoPct.pctMax),
            };
            delete consulta.especificas.rangoPct;
          }
          if (consulta.especificas.rangoTas) {
            consulta.especificas = {
              ...consulta.especificas,
              tas: Between(consulta.especificas.rangoTas.tasMin, consulta.especificas.rangoTas.tasMax),
            };
            delete consulta.especificas.rangoTas;
          }
          if (consulta.especificas.rangoTad) {
            consulta.especificas = {
              ...consulta.especificas,
              tad: Between(consulta.especificas.rangoTad.tadMin, consulta.especificas.rangoTad.tadMax),
            };
            delete consulta.especificas.rangoTad;
          }
        }
        const clinicaData = await this.clinicaORM.find({ where: consulta.especificas });
        const resultadosClinica = consultas
          .map((consulta) => {
            const datosClinica = clinicaData.find((clinica) => clinica.id_consulta === consulta.id);
            return datosClinica ? { ...consulta, clinica: datosClinica } : null;
          })
          .filter((consulta) => consulta !== null);
        resultados.push(...resultadosClinica);
      }
      if (data.consultasSeleccionadas.includes('Odontologia')) {
        // Odontologia
        if (consulta.especificas) {
          if (consulta.especificas.rangoDientesPermanentes) {
            consulta.especificas = {
              ...consulta.especificas,
              dientes_permanentes: Between(consulta.especificas.rangoDientesPermanentes.dientesPermanentesMin, consulta.especificas.rangoDientesPermanentes.dientesPermanentesMax),
            };
            delete consulta.especificas.rangoDientesPermanentes;
          }
          if (consulta.especificas.rangoDientesTemporales) {
            consulta.especificas = {
              ...consulta.especificas,
              dientes_temporales: Between(consulta.especificas.rangoDientesTemporales.dientesTemporalesMin, consulta.especificas.rangoDientesTemporales.dientesTemporalesMax),
            };
            delete consulta.especificas.rangoDientesTemporales;
          }
          if (consulta.especificas.rangoSellador) {
            consulta.especificas = {
              ...consulta.especificas,
              sellador: Between(consulta.especificas.rangoSellador.selladorMin, consulta.especificas.rangoSellador.selladorMax),
            };
            delete consulta.especificas.sellador;
          }
        }
        const odontologiaData = await this.odontologiaORM.find({ where: consulta.especificas });
        const resultadosOdontologia = consultas
          .map((consulta) => {
            const datosOdontologia = odontologiaData.find((odontologia) => odontologia.id_consulta === consulta.id);
            return datosOdontologia ? { ...consulta, odontologia: datosOdontologia } : null;
          })
          .filter((consulta) => consulta !== null);
        resultados.push(...resultadosOdontologia);
      }
      if (data.consultasSeleccionadas.includes('Oftalmologia')) {
        // Oftalmologia
        if (consulta.especificas) {
          if (consulta.especificas.rangoFechasProxControl) {
            consulta.especificas = {
              ...consulta.especificas,
              prox_control: Between(consulta.especificas.rangoFechasProxControl[0], consulta.especificas.rangoFechasProxControl[1]),
            };
            delete consulta.especificas.rangoFechasProxControl;
          }
        }
        const oftalmologiaData = await this.oftalmologiaORM.find({ where: consulta.especificas });
        const resultadosOftalmologia = consultas
          .map((consulta) => {
            const datosOftalmologia = oftalmologiaData.find((oftalmologia) => oftalmologia.id_consulta === consulta.id);
            return datosOftalmologia ? { ...consulta, oftalmologia: datosOftalmologia } : null;
          })
          .filter((consulta) => consulta !== null);
        resultados.push(...resultadosOftalmologia);
      }
      if (data.consultasSeleccionadas.includes('Fonoaudiologia')) {
        // Fonoaudiologia
        const fonoaudiologiaData = await this.fonoaudiologiaORM.find({ where: consulta.especificas });
        const resultadosFonoaudiologia = consultas
          .map((consulta) => {
            const datosFonoaudiologia = fonoaudiologiaData.find((fonoaudiologia) => fonoaudiologia.id_consulta === consulta.id);
            return datosFonoaudiologia ? { ...consulta, fonoaudiologia: datosFonoaudiologia } : null;
          })
          .filter((consulta) => consulta !== null);
        resultados.push(...resultadosFonoaudiologia);
      } else {
        // Deberia dar error esto!!!!
        // console.log('No se especifico tipo.. ');
      }
      return resultados;
    }
    return formatearFecha(consultas);
  }

  prepararDataConsultaPersonalizada(data) {
    const consulta = { ...data };
    if (!consulta.generales) return consulta;
    consulta.generales = {
      ...consulta.generales,
      deshabilitado: false,
    };
    if (consulta.consultasSeleccionadas) delete consulta.consultasSeleccionadas;
    if (consulta.generales.rangoFechas) {
      consulta.generales = {
        ...consulta.generales,
        created_at: Between(consulta.generales.rangoFechas[0], consulta.generales.rangoFechas[1]),
      };
      delete consulta.generales.rangoFechas;
    }
    if (consulta.generales.observaciones === true) {
      consulta.generales = {
        ...consulta.generales,
        observaciones: Not(IsNull()),
      };
    } else if (consulta.generales.observaciones === false) {
      consulta.generales = {
        ...consulta.generales,
        observaciones: IsNull(),
      };
    }
    return consulta;
  }

  findAll() {
    return this.consultaORM.find({ where: { deshabilitado: false }, relations: ['chico', 'institucion', 'curso', 'usuario'] });
  }

  async findAllByYear(year: number) {
    const consultas = await this.consultaORM.find({
      where: { deshabilitado: false, created_at: Raw((alias) => `EXTRACT(YEAR FROM ${alias}) = :year`, { year }) },
      relations: ['chico', 'institucion', 'curso', 'usuario'],
    });
    return formatearFecha(consultas);
  }

  async update(id: number, cambios: UpdateConsultaDto) {
    if (Object.keys(cambios).length === 0) throw new BadRequestException(`No se enviaron cambios`);
    // Consulta
    const consulta = await this.consultaORM.findOne({ where: { deshabilitado: false, id: id }, relations: ['chico', 'institucion', 'curso', 'usuario'] });
    if (!consulta) throw new NotFoundException(`Consulta con id ${id} no encontrada`);
    // Curso
    const idCurso = cambios.id_curso ? cambios.id_curso : null;
    let cursoEncontrado: Curso | null = null;
    if (!idCurso) cursoEncontrado = null;
    else {
      cursoEncontrado = await this.cursoORM.findOne({ where: { id: idCurso, deshabilitado: false } });
      if (!cursoEncontrado) throw new NotFoundException(`Curso con id ${cambios.id_curso} no encontrado`);
    }
    // Institucion
    const idInstitucion = cambios.id_institucion ? cambios.id_institucion : null;
    let institucionEncontrada: Institucion | null = null;
    if (!idInstitucion) institucionEncontrada = null;
    else {
      institucionEncontrada = await this.institucionORM.findOne({ where: { id: idInstitucion, deshabilitado: false } });
      if (!institucionEncontrada) throw new NotFoundException(`Institución con id ${cambios.id_institucion} no encontrada`);
    }
    // Chico
    const idChico = cambios.id_chico ? cambios.id_chico : null;
    let chicoEncontrado: Chico | null = null;
    if (!idChico) chicoEncontrado = null;
    else {
      chicoEncontrado = await this.chicoORM.findOne({ where: { id: idChico, deshabilitado: false } });
      if (!chicoEncontrado) throw new NotFoundException(`Chico con id ${cambios.id_chico} no encontrado`);
    }
    // Aplica cambios generales
    const { clinica, oftalmologia, odontologia, fonoaudiologia, ...cambiosConsulta } = cambios;
    const cambiosAplicadosConsulta = {
      ...cambiosConsulta,
      ...(cursoEncontrado ? { curso: cursoEncontrado } : {}),
      ...(chicoEncontrado ? { chico: chicoEncontrado } : {}),
      ...(institucionEncontrada ? { institucion: institucionEncontrada } : {}),
    };
    const consultaModificada = this.consultaORM.merge(consulta, cambiosAplicadosConsulta);
    await this.consultaORM.save(consultaModificada);
    // Cambios especificos
    if (clinica) {
      const clinicaEncontrada = await this.clinicaORM.findOne({ where: { id_consulta: id } });
      if (!clinicaEncontrada) throw new NotFoundException(`Clínica asociada a consulta con id ${id} no encontrada`);
      let imc: number | null = null;
      let estado_nutricional: string | null = null;
      let tension_arterial: string | null = null;
      if (clinica.talla && clinica.peso) {
        imc = clinica.peso / ((clinica.talla / 100) * (clinica.talla / 100));
      } else if (clinica.peso) {
        imc = clinica.peso / ((clinicaEncontrada.talla / 100) * (clinicaEncontrada.talla / 100));
      } else if (clinica.talla) {
        imc = clinicaEncontrada.peso / ((clinica.talla / 100) * (clinica.talla / 100));
      }
      if (clinica.pcimc) {
        estado_nutricional = estadoNutricional(clinica.pcimc);
      }
      if (clinica.pcta) {
        tension_arterial = tensionArterial(clinica.pcta);
      }
      const cambiosAplicadosClinica = {
        ...clinica,
        ...(imc !== null ? { imc } : {}),
        ...(estado_nutricional !== null ? { estado_nutricional } : {}),
        ...(tension_arterial !== null ? { tension_arterial } : {}),
      };
      const clinicaModificada = this.clinicaORM.merge(clinicaEncontrada, cambiosAplicadosClinica);
      await this.clinicaORM.save(clinicaModificada);
    } else if (oftalmologia) {
      const oftalmologiaEncontrada = await this.oftalmologiaORM.findOne({ where: { id_consulta: id } });
      if (!oftalmologiaEncontrada) throw new NotFoundException(`Oftalmologia asociada a consulta con id ${id} no encontrada`);
      const oftalmologiaModificada = this.oftalmologiaORM.merge(oftalmologiaEncontrada, oftalmologia);
      await this.oftalmologiaORM.save(oftalmologiaModificada);
    } else if (odontologia) {
      const odontologiaEncontrada = await this.odontologiaORM.findOne({ where: { id_consulta: id } });
      if (!odontologiaEncontrada) throw new NotFoundException(`Odontologia asociada a consulta con id ${id} no encontrada`);
      let clasificacion: string | null = null;
      if (odontologia.dientes_recuperables >= 0 && odontologia.dientes_irecuperables >= 0) {
        clasificacion = clasificacionDental(odontologia.dientes_recuperables, odontologia.dientes_irecuperables);
      } else if (odontologia.dientes_recuperables >= 0) {
        clasificacion = clasificacionDental(odontologia.dientes_recuperables, odontologiaEncontrada.dientes_irecuperables);
      } else if (odontologia.dientes_irecuperables >= 0) {
        clasificacion = clasificacionDental(odontologiaEncontrada.dientes_recuperables, odontologia.dientes_irecuperables);
      }
      const cambiosAplicadosOdontologia = {
        ...odontologia,
        ...(clasificacion !== null ? { clasificacion } : {}),
      };
      const odontologiaModificada = this.odontologiaORM.merge(odontologiaEncontrada, cambiosAplicadosOdontologia);
      await this.odontologiaORM.save(odontologiaModificada);
    } else if (fonoaudiologia) {
      const fonoaudiologiaEncontrada = await this.fonoaudiologiaORM.findOne({ where: { id_consulta: id } });
      if (!fonoaudiologiaEncontrada) throw new NotFoundException(`Fonoaudiologia asociada a consulta con id ${id} no encontrada`);
      const fonoaudiologiaModificada = this.fonoaudiologiaORM.merge(fonoaudiologiaEncontrada, fonoaudiologia);
      await this.fonoaudiologiaORM.save(fonoaudiologiaModificada);
    }
    // Resultados
    return {
      ...consultaModificada,
      ...(cambios.clinica ? { clinica: await this.clinicaORM.findOne({ where: { id_consulta: id } }) } : {}),
      ...(cambios.oftalmologia ? { oftalmologia: await this.oftalmologiaORM.findOne({ where: { id_consulta: id } }) } : {}),
      ...(cambios.odontologia ? { odontologia: await this.odontologiaORM.findOne({ where: { id_consulta: id } }) } : {}),
      ...(cambios.fonoaudiologia ? { fonoaudiologia: await this.fonoaudiologiaORM.findOne({ where: { id_consulta: id } }) } : {}),
    };
  }

  async remove(id: number) {
    const consulta = await this.consultaORM.findOne({ where: { deshabilitado: false, id } });
    if (!consulta) throw new NotFoundException(`Consulta con id ${id} no encontrada`);
    consulta.deshabilitado = true;
    return this.consultaORM.save(consulta);
  }
}

function formatearFecha(results: any[]): any[] {
  const formatDate = (date: Date): string =>
    [
      date.getDate().toString().padStart(2, '0'), // Día
      (date.getMonth() + 1).toString().padStart(2, '0'), // Mes
      date.getFullYear(), // Año
    ].join('-');

  return results.map((result) => ({
    ...result,
    created_at: result.created_at ? formatDate(new Date(result.created_at)) : null,
  }));
}

function estadoNutricional(pcimc: number) {
  if (pcimc < 4) return 'B Bajo peso/Desnutrido';
  if (pcimc >= 4 && pcimc < 10) return 'A Riesgo Nutricional';
  if (pcimc >= 10 && pcimc < 85) return 'C Eutrófico';
  if (pcimc >= 85 && pcimc < 95) return 'D Sobrepeso';
  if (pcimc >= 95) return 'E Obesidad';
  else return 'Sin clasificación';
}

function tensionArterial(pcta: number) {
  if (pcta < 90) return 'Normotenso';
  if (pcta >= 90 && pcta < 95) return 'Riesgo';
  if (pcta >= 95) return 'Hipertenso';
  else return 'Sin clasificación';
}

function clasificacionDental(dR: number, dIr: number) {
  if (dR == 0 && dIr == 0) return 'Boca sana';
  else if (dR <= 4 && dIr == 0) return 'Bajo índice de caries';
  else if (dIr == 1) return 'Moderado índice de caries';
  else if (dIr > 1) return 'Alto índice de caries';
  else return 'Sin clasificación';
}
