import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository, SelectQueryBuilder } from 'typeorm';

import { ConsultaService } from 'src/consulta/consulta.service';
import { Consulta } from 'src/consulta/entities/consulta.entity';
import { Chico } from 'src/chico/entities/chico.entity';

@Injectable()
export class ExportService {
  constructor(
    @InjectRepository(Consulta) private readonly consultaORM: Repository<Consulta>,
    @InjectRepository(Chico) private readonly chicoORM: Repository<Chico>,
    private readonly consultaService: ConsultaService,
  ) {}

  async exportarConsultas(data: any) {
    const searchConsultasGenerales = await this.armarConsultaOrmPersonalizada(data);
    const consultas = await this.consultaORM.find(searchConsultasGenerales);
    const consultasLimpias = eliminarValoresNulosYVacios(consultas);
    console.log(Object.keys(consultasLimpias).length);
    return consultasLimpias;
  }

  async exportarChicos(data: any) {
    const query = this.armarConsultaChicos(data);
    const chicos = await query.getMany();
    console.log(Object.keys(chicos).length);
    return chicos;
  }

  armarConsultaChicos(data: any): SelectQueryBuilder<Chico> {
    const query = this.chicoORM.createQueryBuilder('chico').leftJoinAndSelect('chico.barrio', 'barrio').leftJoinAndSelect('barrio.localidad', 'localidad').orderBy('chico.created_at', 'DESC');
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
      query.andWhere('chico.nombre ILIKE :nombre', { nombre: `%${data.nombre}%` });
    }
    if (data.apellido) {
      query.andWhere('chico.apellido ILIKE :apellido', { apellido: `%${data.apellido}%` });
    }
    if (data.sexo) {
      query.andWhere('chico.sexo = :sexo', { sexo: `${data.sexo}` });
    }
    /*
    const query2 = this.chicoORM
      .createQueryBuilder('chico')
      .leftJoin('chico.barrio', 'barrio')
      .leftJoin('barrio.localidad', 'localidad')
      .select(['chico.id AS id', 'chico.created_at AS created_at', 'chico.updated_at AS updated_at', 'chico.deshabilitado AS deshabilitado', 'chico.dni AS dni', 'chico.nombre AS nombre', 'chico.apellido AS apellido', 'chico.sexo AS sexo', "TO_CHAR(chico.fe_nacimiento, 'DD-MM-YYYY') AS fe_nacimiento", 'chico.direccion AS direccion', 'chico.telefono AS telefono', 'chico.nombre_madre AS nombre_madre', 'chico.nombre_padre AS nombre_padre', 'chico.id_barrio AS id_barrio', 'localidad.id AS id_localidad'])
      .addSelect((subQuery) => {
        return subQuery.select('CAST(COUNT(DISTINCT consulta.type) AS INTEGER)', 'actividad').from(Consulta, 'consulta').where('consulta.id_chico = chico.id').andWhere('consulta.deshabilitado = false AND EXTRACT(YEAR FROM consulta.created_at) = :year', { year });
      }, 'actividad')
      .orderBy('chico.created_at', 'DESC');
      */
    //data.actividad = 0, 1, 2, 3 o 4
    if (data.actividad) {
    }
    return query;
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
