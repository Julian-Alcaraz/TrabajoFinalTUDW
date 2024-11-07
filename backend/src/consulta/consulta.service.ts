import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Between, EntityManager, Repository } from 'typeorm';
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
        // nuevaConsultaHija = manager.create(clinica, { consultaId: consultaGuardada.id, ...clinica, imc, estado_nutricional, tension_arterial });
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

      // return consultaGuardada; //devuelve solo la consulta
      // return { ...consultaGuardada, ...consultaHijaGuardada }; // devuelve laconsulta join consultahija un solo objeto
      // return consultaHijaGuardada; // devuelve la consulta hija con un objeto de la consulta

      // de esta forma devuelve todo como si fuera el mismo registro, para mi la mejor forma
      delete consultaHijaGuardada.consulta;
      delete consultaHijaGuardada.id_consulta;
      return { ...consultaGuardada, ...consultaHijaGuardada };
    });
  }

  async findOne(id: number) {
    const consulta = await this.consultaORM.findOne({ where: { id }, relations: ['curso', 'institucion', 'usuario'] });
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
    return { ...consulta, consultaHija };
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
    const consulta = { ...data };
    consulta.generales = {
      ...consulta.generales,
      deshabilitado: false,
    };
    if (consulta.consultasSeleccionadas) delete consulta.consultasSeleccionadas;
    if (consulta.generales.rangoFechas) {
      console.log('FECHA 1:', consulta.generales.rangoFechas[0]);
      console.log('FECHA 2:', consulta.generales.rangoFechas[1]);
      consulta.generales = {
        ...consulta.generales,
        created_at: Between(consulta.generales.rangoFechas[0], consulta.generales.rangoFechas[1]),
      };
      delete consulta.generales.rangoFechas;
    }
    console.log('CONSULTA BD: ', consulta);
    const consultas = await this.consultaORM.find({ relations: ['chico', 'institucion', 'curso', 'usuario'], where: consulta.generales });

    if (data.consultasSeleccionadas && data.consultasSeleccionadas.length === 1) {
      if (data.consultasSeleccionadas.includes('Clinica')) {
        const clinicaData = await this.clinicaORM.find({ where: consulta.especificas });

        const resultados = consultas
          .map((consulta) => {
            const datosClinica = clinicaData.find((clinica) => clinica.id_consulta === consulta.id);
            return datosClinica ? { ...consulta, clinica: datosClinica } : null;
          })
          .filter((consulta) => consulta !== null);
        return resultados;
      } else if (data.consultasSeleccionadas.includes('Odontologia')) {
        console.log('Odontologia!');
      } else if (data.consultasSeleccionadas.includes('Oftalmologia')) {
        console.log('Oftalmologia!!!!!!!!!!!!!!!!');
        const oftalmologiaData = await this.oftalmologiaORM.find({ where: consulta.especificas });
        const resultados = consultas
          .map((consulta) => {
            const datosOftalmologia = oftalmologiaData.find((oftalmologia) => oftalmologia.id_consulta === consulta.id);
            return datosOftalmologia ? { ...consulta, oftalmologia: datosOftalmologia } : null;
          })
          .filter((consulta) => consulta !== null);
        console.log(resultados);
        return resultados;
      } else if (data.consultasSeleccionadas.includes('Fonoaudiologia')) {
        console.log('Fonoaudiologia!');
      } else {
        console.log('No se especifico tipo.. ');
      }
    }
    return consultas;
  }

  findAll() {
    return this.consultaORM.find({ where: { deshabilitado: false }, relations: ['chico', 'institucion', 'curso', 'usuario'] });
  }

  update(id: number, updateConsultaDto: UpdateConsultaDto) {
    return `This action updates a #${id} consulta`;
  }

  remove(id: number) {
    return `This action removes a #${id} consulta`;
  }
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
