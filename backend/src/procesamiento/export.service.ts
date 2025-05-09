import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ConsultaService } from 'src/consulta/consulta.service';
import { Consulta } from 'src/consulta/entities/consulta.entity';

@Injectable()
export class ExportService {
  constructor(
    @InjectRepository(Consulta) private readonly consultaORM: Repository<Consulta>,
    private readonly consultaService: ConsultaService,
  ) {}

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
