import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Taller } from './entities/taller.entity';
import { Marco } from '../marco/entities/marco.entity';
import { Especialidad } from '../especialidad/entities/especialidad.entity';
import { EspecialidadEnum } from '../common/const/const';

@Injectable()
export class GraficosService {
  constructor(
    @InjectRepository(Taller) private readonly tallerORM: Repository<Taller>,
    @InjectRepository(Marco) private readonly marcoORM: Repository<Marco>,
    @InjectRepository(Especialidad) private readonly especialidadORM: Repository<Marco>,
  ) {}

  async countByYear(year: number) {
    const respuesta = [];
    for (let i = 0; i < 4; i++) {
      const countTalleres = await this.tallerORM.createQueryBuilder('taller').where('taller.deshabilitado=false').andWhere('taller.es_taller=true').andWhere('EXTRACT(YEAR FROM taller.fecha) = :year', { year }).getCount();
      respuesta.push(countTalleres);
      year--;
    }
    return respuesta.reverse();
  }

  async countTypeByYear(year: number, id_curso: number, porcentaje: number) {
    const types = EspecialidadEnum;
    const resultado = [];
    for (let i = 0; i < 4; i++) {
      const currentYear = year - (3 - i);
      const counts = await Promise.all(
        types.map(async (type) => {
          let query = this.tallerORM.createQueryBuilder('taller').innerJoin('taller.curso', 'curso').innerJoin('taller.especialidad', 'especialidad').where('taller.deshabilitado=false').andWhere('taller.es_taller=true').andWhere('EXTRACT(YEAR FROM taller.fecha) = :year', { year: currentYear }).andWhere('especialidad.nombre = :type', { type });

          if (id_curso !== 0) {
            query = query.andWhere('taller.id_curso = :id_curso', { id_curso });
          }

          return query.getCount();
        }),
      );
      if (porcentaje === 1) {
        resultado.push({
          label: currentYear.toString(),
          data: calcularPorcentaje(counts),
        });
      } else {
        resultado.push({
          label: currentYear.toString(),
          data: counts,
        });
      }
    }
    return resultado;
  }

  async countParticipantesxEspecialidad(year: number, id_curso: number, porcentaje: number, participantes: number) {
    const types = EspecialidadEnum;
    const resultado = [];

    for (let i = 0; i < 4; i++) {
      const currentYear = year - (3 - i);
      const arrayData = [];

      for (const type of types) {
        let query;
        if (participantes === 1) {
          query = this.tallerORM.createQueryBuilder('taller').select('SUM(taller.cant_participantes)', 'total').innerJoin('taller.curso', 'curso').innerJoin('taller.especialidad', 'especialidad').where('taller.deshabilitado = false').andWhere('taller.es_taller = true').andWhere('EXTRACT(YEAR FROM taller.fecha) = :year', { year: currentYear }).andWhere('especialidad.nombre = :type', { type });
        } else {
          query = this.tallerORM.createQueryBuilder('taller').select('SUM(taller.cant_encuentros)', 'total').innerJoin('taller.curso', 'curso').innerJoin('taller.especialidad', 'especialidad').where('taller.deshabilitado = false').andWhere('taller.es_taller = true').andWhere('EXTRACT(YEAR FROM taller.fecha) = :year', { year: currentYear }).andWhere('especialidad.nombre = :type', { type });
        }

        if (id_curso !== 0) {
          query = query.andWhere('taller.id_curso = :id_curso', { id_curso });
        }
        const result = await query.getRawOne();
        arrayData.push(parseInt(result.total || 0));
      }

      if (porcentaje === 1) {
        resultado.push({
          label: currentYear.toString(),
          data: calcularPorcentaje(arrayData),
        });
      } else {
        resultado.push({
          label: currentYear.toString(),
          data: arrayData,
        });
      }
    }
    return resultado;
  }

  async countCantEncuentrosxMarco(year: number, id_curso: number, porcentaje: number, participantes: number) {
    const especialidades = await this.especialidadORM.find({ where: { deshabilitado: false } });
    const resultados: { [nombre: string]: any } = {};
    for (const especialidad of especialidades) {
      resultados[especialidad.nombre.toLowerCase()] = await this.countCantEncuentrosxMarcoInterno(year, id_curso, porcentaje, participantes, especialidad.nombre);
    }
    return resultados;
  }

  async countCantEncuentrosxMarcoInterno(year: number, id_curso: number, porcentaje: number, participantes: number, nombreEspecialidad: string) {
    const resultado: { label: string; data: number[] }[] = [];

    const marcos = await this.marcoORM
      .createQueryBuilder('marco')
      .select('marco.nombre', 'nombre')
      .innerJoin('marco.especialidad', 'especialidad')
      .where('especialidad.nombre = :nombreEspecialidad', {
        nombreEspecialidad: nombreEspecialidad,
      })
      .orderBy('marco.nombre', 'ASC')
      .getRawMany();

    const nombresMarcos = marcos.map((m) => m.nombre);
    for (let i = 0; i < 4; i++) {
      const currentYear = year - (3 - i);
      let query;
      if (participantes === 1) {
        query = this.tallerORM
          .createQueryBuilder('taller')
          .select('marco.nombre', 'marco')
          .addSelect('SUM(taller.cant_participantes)', 'total')
          .innerJoin('taller.curso', 'curso')
          .innerJoin('taller.especialidad', 'especialidad')
          .innerJoin('taller.marco', 'marco')
          .where('taller.deshabilitado = false')
          .andWhere('taller.es_taller = true')
          .andWhere('especialidad.nombre = :nombreEspecialidad', {
            nombreEspecialidad: nombreEspecialidad,
          })
          .andWhere('EXTRACT(YEAR FROM taller.fecha) = :year', { year: currentYear })
          .groupBy('marco.nombre');
      } else {
        query = this.tallerORM
          .createQueryBuilder('taller')
          .select('marco.nombre', 'marco')
          .addSelect('SUM(taller.cant_encuentros)', 'total')
          .innerJoin('taller.curso', 'curso')
          .innerJoin('taller.especialidad', 'especialidad')
          .innerJoin('taller.marco', 'marco')
          .where('taller.deshabilitado = false')
          .andWhere('taller.es_taller = true')
          .andWhere('especialidad.nombre = :nombreEspecialidad', {
            nombreEspecialidad: nombreEspecialidad,
          })
          .andWhere('EXTRACT(YEAR FROM taller.fecha) = :year', { year: currentYear })
          .groupBy('marco.nombre');
      }

      if (id_curso !== 0) {
        query = query.andWhere('taller.id_curso = :id_curso', { id_curso });
      }

      const result = await query.getRawMany();

      const mapMarcoTotal = new Map<string, number>();
      for (const row of result) {
        mapMarcoTotal.set(row.marco, parseInt(row.total || 0));
      }
      const data = nombresMarcos.map((nombre) => mapMarcoTotal.get(nombre) ?? 0);
      if (porcentaje === 1) {
        resultado.push({
          label: currentYear.toString(),
          data: calcularPorcentaje(data),
        });
      } else {
        resultado.push({
          label: currentYear.toString(),
          data,
        });
      }
    }

    return resultado;
  }

  async countCantTalleresxTipo(year: number, id_curso: number) {
    const types = EspecialidadEnum;
    const respuesta = await Promise.all(
      types.map(async (type) => {
        let query = this.tallerORM.createQueryBuilder('taller').innerJoin('taller.curso', 'curso').innerJoin('taller.especialidad', 'especialidad').where('taller.deshabilitado=false').andWhere('taller.es_taller=true').andWhere('especialidad.nombre = :nombreEspecialidad', {
          nombreEspecialidad: type,
        });
        if (year !== 0) {
          query = query.andWhere('EXTRACT(YEAR FROM taller.fecha) = :year', { year });
        }
        if (id_curso !== 0) {
          query = query.andWhere('taller.id_curso = :id_curso', { id_curso });
        }
        return await query.getCount();
      }),
    );
    return respuesta;
  }
}

function calcularPorcentaje(data: number[]) {
  const total = data.reduce((sum, value) => sum + value, 0);
  const porcentajes = data.map((value) => +((value * 100) / total).toFixed(2));
  return porcentajes;
}
