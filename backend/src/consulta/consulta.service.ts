import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { CreateConsultaDto } from './dto/create-consulta.dto';
import { UpdateConsultaDto } from './dto/update-consulta.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Consulta } from './entities/consulta.entity';

import { Fonoaudiologia } from './entities/fonoaudiologia.entity';
import { Oftalmologia } from './entities/oftalmologia.entity';
import { ClinicaGeneral } from './entities/clinica.entity';
import { Odontologia } from './entities/odontologia.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { Institucion } from 'src/institucion/entities/institucion.entity';
import { Curso } from 'src/curso/entities/curso.entity';
import { Chico } from 'src/chico/entities/chico.entity';

@Injectable()
export class ConsultaService {
  constructor(
    @InjectRepository(Consulta) private readonly consultaORM: Repository<Consulta>,
    @InjectRepository(ClinicaGeneral) private readonly clinicaORM: Repository<ClinicaGeneral>,
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
      // 1. Validar existencia de entidades relacionadas (chico, barrio, etc.) si es necesario
      // usuario no lo valido por que es el que inicio la session
      const curso = await manager.findOne(Curso, { where: { id: consultaCreate.cursoId, deshabilitado: false } });
      if (!curso) throw new BadRequestException('El curso ingresado no existe');
      const institucion = await manager.findOne(Institucion, { where: { id: consultaCreate.institucionId, deshabilitado: false } });
      if (!institucion) throw new BadRequestException('La institucion ingresada no existe');
      const chico = await manager.findOne(Chico, { where: { id: consultaCreate.chicoId, deshabilitado: false } });
      if (!chico) throw new BadRequestException('El chico ingresado no existe');
      const nuevaConsulta = manager.create(Consulta, { ...consultaCreate, usuario, chico, institucion, curso });
      const consultaGuardada = await manager.save(nuevaConsulta);
      if (!consultaGuardada) throw new BadRequestException('La carga de la consulta falló');

      // 3. Crear la consulta hija, según el tipo de consulta
      let nuevaConsultaHija = null;
      let consultaHijaGuardada = null;

      if (clinica) {
        const imc = clinica.peso / (clinica.talla / 100);
        const estado_nutricional = estadoNutricional(clinica.pcimc);
        const tension_arterial = tensionArterial(clinica.pcta);
        // cualquiera de las dos formas esta bien, nose cual es mejor!!!!!
        nuevaConsultaHija = manager.create(ClinicaGeneral, { consulta: consultaGuardada, ...clinica, imc, estado_nutricional, tension_arterial });
        // nuevaConsultaHija = manager.create(ClinicaGeneral, { consultaId: consultaGuardada.id, ...clinica, imc, estado_nutricional, tension_arterial });
        consultaHijaGuardada = await manager.save(nuevaConsultaHija);
      }

      if (fonoaudiologia) {
        // agregar campos que se tienen que calcular

        nuevaConsultaHija = manager.create(Fonoaudiologia, { consultaId: consultaGuardada.id, ...fonoaudiologia });
        consultaHijaGuardada = await manager.save(nuevaConsultaHija);
      }

      if (createConsultaDto.oftalmologia) {
        // agregar campos que se tienen que calcular

        nuevaConsultaHija = manager.create(Oftalmologia, { consultaId: consultaGuardada.id, ...createConsultaDto.oftalmologia });
        consultaHijaGuardada = await manager.save(nuevaConsultaHija);
      }

      if (createConsultaDto.odontologia) {
        // agregar campos que se tienen que calcular

        nuevaConsultaHija = manager.create(Odontologia, { consultaId: consultaGuardada.id, ...createConsultaDto.odontologia });
        consultaHijaGuardada = await manager.save(nuevaConsultaHija);
      }

      // Si no se creó ninguna consulta hija, lanzamos un error y se hace rollback
      if (!nuevaConsultaHija) {
        throw new BadRequestException('Fallo la carga de la consulta hija');
      }

      // return consultaGuardada; //devuelve solo la consulta
      // return { ...consultaGuardada, ...consultaHijaGuardada }; // devuelve laconsulta join consultahija un solo objeto
      return consultaHijaGuardada; // devuelve laconsulta join consultahija un solo objeto
    });
  }

  findAll() {
    return `This action returns all consulta`;
  }

  findOne(id: number) {
    return `This action returns a #${id} consulta`;
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
  if (pcimc >= 85 && pcimc < 98) return 'D Sobrepeso';
  if (pcimc >= 95) return 'E Obesidad';
}
function tensionArterial(pcta) {
  if (pcta < 90) return 'Normotenso';
  if (pcta >= 90 && pcta < 95) return 'Riesgo';
  if (pcta >= 95) return 'Hipertenso';
}
