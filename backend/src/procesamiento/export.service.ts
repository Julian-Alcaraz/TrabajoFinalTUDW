import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository, SelectQueryBuilder } from 'typeorm';

import { ConsultaService } from 'src/consulta/consulta.service';
import { Consulta } from 'src/consulta/entities/consulta.entity';
import { Chico } from 'src/chico/entities/chico.entity';
import { Taller } from 'src/taller/entities/taller.entity';

@Injectable()
export class ExportService {
  constructor(
    @InjectRepository(Consulta) private readonly consultaORM: Repository<Consulta>,
    @InjectRepository(Chico) private readonly chicoORM: Repository<Chico>,
    @InjectRepository(Taller) private readonly tallerORM: Repository<Taller>,
    private readonly consultaService: ConsultaService,
  ) {}

  async exportarTalleres(data: any) {
    const query = this.armarConsultaTalleres(data);
    const talleres = await query.getMany();
    return talleres;
  }

  armarConsultaTalleres(data: any): SelectQueryBuilder<Taller> {
    const query = this.tallerORM.createQueryBuilder('taller').leftJoinAndSelect('taller.institucion', 'barrio').leftJoinAndSelect('taller.curso', 'localidad').leftJoinAndSelect('taller.marco', 'marco').leftJoinAndSelect('taller.especialidad', 'especialidad').orderBy('taller.created_at', 'DESC').where('taller.deshabilitado=false');
    if (data.nombre) {
      const nombre = sacarAcentos(data.nombre.toLowerCase());
      query.andWhere('unaccent(LOWER(taller.nombre)) ILIKE :nombre', { nombre: `%${nombre}%` });
    }
    if (data.turno) {
      query.andWhere('taller.turno = :turno', { turno: `${data.turno}` });
    }
    if (data.frecuencia) {
      query.andWhere('taller.frecuencia = :frecuencia', { frecuencia: `${data.frecuencia}` });
    }
    if (data.duracion) {
      query.andWhere('taller.duracion = :duracion', { duracion: `${data.duracion}` });
    }
    if (data.destinatarios) {
      query.andWhere('taller.destinatarios = :destinatarios', { destinatarios: `${data.destinatarios}` });
    }
    if (data.institucion) {
      query.andWhere('taller.institucion.id = :idInstitucion', { idInstitucion: data.institucion });
    }
    if (data.curso) {
      query.andWhere('taller.curso.id = :idCurso', { idCurso: data.curso });
    }
    if (data.especialidad) {
      query.andWhere('taller.especialidad.id = :idEspecialidad', { idEspecialidad: data.especialidad });
    }
    if (data.marco) {
      query.andWhere('taller.marco.id = :idMarco', { idMarco: data.marco });
    }
    if (data.conjuntoCon) {
      query.andWhere('taller.conjunto_con = :conjuntoCon', { conjuntoCon: data.conjuntoCon });
    }
    if (data.esTaller !== null && data.esTaller !== undefined) {
      query.andWhere('taller.es_taller = :esTaller', { esTaller: data.esTaller });
    }
    return query;
  }

  async exportarChicos(data: any) {
    const query = this.armarConsultaChicos(data);
    const chicos = await query.getMany();
    return chicos;
  }

  armarConsultaChicos(data: any): SelectQueryBuilder<Chico> {
    const query = this.chicoORM.createQueryBuilder('chico').leftJoinAndSelect('chico.barrio', 'barrio').leftJoinAndSelect('barrio.localidad', 'localidad').where('chico.deshabilitado = false').orderBy('chico.created_at', 'DESC');

    if (data.idBarrio) {
      query.andWhere('barrio.id = :idBarrio', { idBarrio: data.idBarrio });
    }
    if (data.idLocalidad) {
      query.andWhere('localidad.id = :idLocalidad', { idLocalidad: data.idLocalidad });
    }
    if (data.estado !== null && data.estado !== undefined) {
      query.andWhere('chico.deshabilitado = :estado', { estado: data.estado });
    }
    if (data.dni) {
      query.andWhere(`CAST(chico.dni AS TEXT) LIKE :dni`, { dni: `${data.dni}%` });
    }
    if (data.nombre) {
      const nombre = sacarAcentos(data.nombre.toLowerCase());
      query.andWhere('unaccent(LOWER(chico.nombre)) ILIKE :nombre', { nombre: `%${nombre}%` });
    }
    if (data.apellido) {
      const apellido = sacarAcentos(data.apellido.toLowerCase());
      query.andWhere('unaccent(LOWER(chico.apellido)) ILIKE :apellido', { apellido: `%${apellido}%` });
    }
    if (data.sexo) {
      query.andWhere('chico.sexo = :sexo', { sexo: `${data.sexo}` });
    }
    if (data.actividad) {
      const year = new Date().getFullYear();
      query.andWhere(
        (qb) => {
          const sub = qb.subQuery().select('COUNT(DISTINCT c.type)').from(Consulta, 'c').where('c.id_chico = chico.id').andWhere('c.deshabilitado = false').andWhere('EXTRACT(YEAR FROM c.created_at) = :year', { year }).getQuery();
          return `${sub} = :actividad`;
        },
        { actividad: data.actividad },
      );
    }
    return query;
  }

  async exportarConsultas(data: any) {
    const searchConsultasGenerales = await this.armarConsultaOrmPersonalizada(data);
    const consultas = await this.consultaORM.find(searchConsultasGenerales);
    const consultasLimpias = eliminarValoresNulosYVacios(consultas);
    return consultasLimpias;
  }

  async armarConsultaOrmPersonalizada(data: any) {
    const filtros = await this.consultaService.prepararDataConsultaPersonalizada(data);
    const consultasSeleccionadas = { ...data.consultasSeleccionadas };
    const searchConsultas: any = {
      relations: ['chico', 'institucion', 'curso', 'usuario', 'chico.barrio', 'clinica', 'odontologia', 'oftalmologia', 'fonoaudiologia', 'prevencion', 'social'],
      order: { created_at: 'DESC' },
      where: filtros.generales,
    };
    let filtrosEspecificos = null;
    if (filtros.especificas) {
      switch (consultasSeleccionadas[0]) {
        case 'Clinica':
          filtrosEspecificos = { clinica: await this.consultaService.procesarClinica(filtros) };
          break;
        case 'Odontologia':
          filtrosEspecificos = { odontologia: await this.consultaService.procesarOdontologia(filtros) };
          break;
        case 'Oftalmologia':
          filtrosEspecificos = { oftalmologia: await this.consultaService.procesarOftalmologia(filtros) };
          break;
        case 'Fonoaudiologia':
          filtrosEspecificos = { fonoaudiologia: await this.consultaService.procesarFonoaudiologia(filtros) };
          break;
        case 'Prevencion':
          filtrosEspecificos = { prevencion: await this.consultaService.procesarPrevencion(filtros) };
          break;
        case 'Social':
          filtrosEspecificos = { social: await this.consultaService.procesarSocial(filtros) };
          break;
      }
    }
    if (filtrosEspecificos) {
      searchConsultas.where = { ...filtros.generales, ...filtrosEspecificos }; // Combina los filtros generales y específicos
    }

    return searchConsultas;
  }
}

function eliminarValoresNulosYVacios(obj: any): any {
  const cleanedObj: any = {};
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    if (key === 'created_at' || key === 'updated_at') {
      cleanedObj[key] = value;
      return;
    }
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      const nestedCleanedObj = eliminarValoresNulosYVacios(value);
      if (Object.keys(nestedCleanedObj).length > 0) {
        cleanedObj[key] = nestedCleanedObj;
      }
    } else if (value !== null && value !== undefined && value !== '') {
      cleanedObj[key] = value;
    }
  });
  return cleanedObj;
}

function sacarAcentos(text: string): string {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}
