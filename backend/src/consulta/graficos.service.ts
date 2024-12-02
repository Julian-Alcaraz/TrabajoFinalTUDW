import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Consulta } from './entities/consulta.entity';

@Injectable()
export class GraficosService {
  constructor(@InjectRepository(Consulta) private readonly consultaORM: Repository<Consulta>) {}

  // GRAFICOS GENERALES
  async countByYear(year: number) {
    const respuesta = [];
    for (let i = 0; i < 4; i++) {
      const countConsultas = await this.consultaORM.createQueryBuilder('consulta').where('consulta.deshabilitado=false AND EXTRACT(YEAR FROM consulta.created_at) = :year', { year }).getCount();
      respuesta.push(countConsultas);
      year--;
    }
    return respuesta.reverse();
  }
  async countTypeByYear(year: number) {
    const types = ['Clinica', 'Odontologia', 'Oftalmologia', 'Fonoaudiologia'];
    const respuesta = {};
    for (let i = 0; i < 4; i++) {
      const counts = await Promise.all(types.map((type) => this.consultaORM.createQueryBuilder('consulta').where('consulta.deshabilitado=false AND EXTRACT(YEAR FROM consulta.created_at) = :year AND consulta.type = :type', { year, type }).getCount()));
      respuesta[year] = counts;
      year--;
    }
    return respuesta;
  }
  async countTypeByYearAndInstitucion(year: number, id_institucion: number) {
    const types = ['Clinica', 'Odontologia', 'Oftalmologia', 'Fonoaudiologia'];
    const respuesta = await Promise.all(
      types.map(async (type) => {
        let query = this.consultaORM.createQueryBuilder('consulta').where('consulta.deshabilitado=false AND consulta.type = :type', { type });
        if (year !== 0) {
          query = query.andWhere('EXTRACT(YEAR FROM consulta.created_at) = :year', { year });
        }
        if (id_institucion !== 0) {
          query = query.andWhere('consulta.id_institucion = :id_institucion', { id_institucion });
        }
        return query.getCount();
      }),
    );
    // const respuesta = await Promise.all(types.map((type) => this.consultaORM.createQueryBuilder('consulta').where('EXTRACT(YEAR FROM consulta.created_at) = :year AND consulta.type = :type AND consulta.id_institucion = :id_institucion ', { year, type, id_institucion }).getCount()));
    return respuesta;
  }
  async tensionxEstadoData(year: number, id: number, estado: string) {
    const types = ['Normotenso', 'Riesgo', 'Hipertenso'];
    const createQuery = (type: string) => {
      let query = this.consultaORM.createQueryBuilder('consulta').leftJoin('consulta.clinica', 'clinica').where('consulta.deshabilitado=false AND clinica.estado_nutricional = :estado  AND clinica.tension_arterial = :type', { estado, type });
      if (year) {
        query = query.andWhere('EXTRACT(YEAR FROM consulta.created_at) = :year', { year });
      }
      if (id) {
        query = query.andWhere('consulta.id_curso = :id', { id });
      }
      return query.getCount();
    };
    const counts = await Promise.all(
      types.map(async (type) => {
        return await createQuery(type);
      }),
    );
    return counts;
  }

  async estadoNutricionalData(year: number, id: number) {
    const types = ['B Bajo peso/Desnutrido', 'A Riesgo Nutricional', 'C Eutrófico', 'D Sobrepeso', 'E Obesidad'];
    const createQuery = (type: string) => {
      let query = this.consultaORM.createQueryBuilder('consulta').leftJoin('consulta.clinica', 'clinica').where('consulta.deshabilitado=false AND clinica.estado_nutricional = :type', { type });
      if (year) {
        query = query.andWhere('EXTRACT(YEAR FROM consulta.created_at) = :year', { year });
      }
      if (id) {
        query = query.andWhere('consulta.id_curso = :id', { id });
      }
      return query.getCount();
    };
    const counts = await Promise.all(
      types.map(async (type) => {
        return await createQuery(type);
      }),
    );
    return counts;
  }

  async porcentajeEstadoNutricional(year: number, id: number, porcentaje: number) {
    const respuesta = {};
    for (let i = 0; i < 4; i++) {
      const data = await this.estadoNutricionalData(year, id);
      if (porcentaje === 1) {
        const porcentajes = calcularPorcentaje(data);
        respuesta[year] = porcentajes;
      } else {
        respuesta[year] = data;
      }
      year--;
    }
    return respuesta;
  }

  async tensionArterialData(year: number, id: number) {
    const types = ['Normotenso', 'Riesgo', 'Hipertenso'];
    const createQuery = (type: string) => {
      let query = this.consultaORM.createQueryBuilder('consulta').leftJoin('consulta.clinica', 'clinica').where('consulta.deshabilitado=false AND clinica.tension_arterial = :type', { type });
      if (year) {
        query = query.andWhere('EXTRACT(YEAR FROM consulta.created_at) = :year', { year });
      }
      if (id) {
        query = query.andWhere('consulta.id_curso = :id', { id });
      }
      return query.getCount();
    };
    const counts = await Promise.all(
      types.map(async (type) => {
        return await createQuery(type);
      }),
    );
    return counts;
  }

  async porcentajeTensionArterialData(year: number, id: number, porcentaje: number) {
    const respuesta = {};
    for (let i = 0; i < 4; i++) {
      const data = await this.tensionArterialData(year, id);
      if (porcentaje === 1) {
        const porcentajes = calcularPorcentaje(data);
        respuesta[year] = porcentajes;
      } else {
        respuesta[year] = data;
      }
      year--;
    }
    return respuesta;
  }

  async examenVisualData(year: number, id: number) {
    const types = ['Normal', 'Anormal'];
    const createQuery = (type: string) => {
      let query = this.consultaORM.createQueryBuilder('consulta').leftJoin('consulta.clinica', 'clinica').where('consulta.deshabilitado=false AND clinica.examen_visual = :type', { type });
      if (year) {
        query = query.andWhere('EXTRACT(YEAR FROM consulta.created_at) = :year', { year });
      }
      if (id) {
        query = query.andWhere('consulta.id_curso = :id', { id });
      }
      return query.getCount();
    };
    const counts = await Promise.all(
      types.map(async (type) => {
        return await createQuery(type);
      }),
    );
    return counts;
  }
  async porcentajeExamenVisualData(year: number, id: number, porcentaje: number) {
    const respuesta = {};
    for (let i = 0; i < 4; i++) {
      const data = await this.examenVisualData(year, id);
      if (porcentaje === 1) {
        const porcentajes = calcularPorcentaje(data);
        respuesta[year] = porcentajes;
      } else {
        respuesta[year] = data;
      }
      year--;
    }
    return respuesta;
  }

  async vacunacionData(year: number, id: number) {
    const types = ['Completo', 'Incompleto', 'Desconocido'];
    const createQuery = (type: string) => {
      let query = this.consultaORM.createQueryBuilder('consulta').leftJoin('consulta.clinica', 'clinica').where('consulta.deshabilitado=false AND  clinica.vacunas = :type', { type });
      if (year) {
        query = query.andWhere('EXTRACT(YEAR FROM consulta.created_at) = :year', { year });
      }
      if (id) {
        query = query.andWhere('consulta.id_curso = :id', { id });
      }
      return query.getCount();
    };
    const counts = await Promise.all(
      types.map(async (type) => {
        return await createQuery(type);
      }),
    );
    return counts;
  }

  async porcentajeVacunacionData(year: number, id: number, porcentaje: number) {
    const respuesta = {};
    for (let i = 0; i < 4; i++) {
      const data = await this.vacunacionData(year, id);
      if (porcentaje === 1) {
        const porcentajes = calcularPorcentaje(data);
        respuesta[year] = porcentajes;
      } else {
        respuesta[year] = data;
      }
      year--;
    }
    return respuesta;
  }

  async ortopediaData(year: number, id: number) {
    const types = ['Normal', 'Anormal'];
    const createQuery = (type: string) => {
      let query = this.consultaORM.createQueryBuilder('consulta').leftJoin('consulta.clinica', 'clinica').where('consulta.deshabilitado=false ');
      if (type === 'Normal') {
        query.where('clinica.ortopedia_traumatologia = :ortopedia', { ortopedia: 'Normal' });
      } else if (type === 'Anormal') {
        query.where('clinica.ortopedia_traumatologia != :ortopedia', { ortopedia: 'Normal' });
      }
      if (year) {
        query = query.andWhere('EXTRACT(YEAR FROM consulta.created_at) = :year', { year });
      }
      if (id) {
        query = query.andWhere('consulta.id_curso = :id', { id });
      }
      return query.getCount();
    };
    const counts = await Promise.all(
      types.map(async (type) => {
        return await createQuery(type);
      }),
    );
    return counts;
  }

  async porcentajeOrtopediaData(year: number, id: number, porcentaje: number) {
    const respuesta = {};
    for (let i = 0; i < 4; i++) {
      const data = await this.ortopediaData(year, id);
      if (porcentaje === 1) {
        const porcentajes = calcularPorcentaje(data);
        respuesta[year] = porcentajes;
      } else {
        respuesta[year] = data;
      }
      year--;
    }
    return respuesta;
  }

  async lenguajeData(year: number, id: number) {
    const types = ['Adecuado', 'Inadecuado'];
    const createQuery = (type: string) => {
      let query = this.consultaORM.createQueryBuilder('consulta').leftJoin('consulta.clinica', 'clinica').where('consulta.deshabilitado=false AND clinica.lenguaje = :type', { type });
      if (year) {
        query = query.andWhere('EXTRACT(YEAR FROM consulta.created_at) = :year', { year });
      }
      if (id) {
        query = query.andWhere('consulta.id_curso = :id', { id });
      }
      return query.getCount();
    };
    const counts = await Promise.all(
      types.map(async (type) => {
        return await createQuery(type);
      }),
    );
    return counts;
  }

  async porcentajeLenguajeData(year: number, id: number, porcentaje: number) {
    const respuesta = {};
    for (let i = 0; i < 4; i++) {
      const data = await this.lenguajeData(year, id);
      if (porcentaje === 1) {
        const porcentajes = calcularPorcentaje(data);
        respuesta[year] = porcentajes;
      } else {
        respuesta[year] = data;
      }
      year--;
    }
    return respuesta;
  }

  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!ODONOTOLOGIA

  async cepilladoData(year: number, id: number) {
    const types = ['Si', 'No'];
    const createQuery = (type: string) => {
      const cepilladoBoolean = type === 'Si';
      let query = this.consultaORM.createQueryBuilder('consulta').leftJoin('consulta.odontologia', 'odontologia').where('consulta.deshabilitado=false AND odontologia.cepillado = :cepilladoBoolean', { cepilladoBoolean });
      if (year) {
        query = query.andWhere('EXTRACT(YEAR FROM consulta.created_at) = :year', { year });
      }
      if (id) {
        query = query.andWhere('consulta.id_curso = :id', { id });
      }
      return query.getCount();
    };
    const counts = await Promise.all(
      types.map(async (type) => {
        return await createQuery(type);
      }),
    );
    return counts;
  }

  async porcentajeCepilladoData(year: number, id: number, porcentaje: number) {
    const respuesta = {};
    for (let i = 0; i < 4; i++) {
      const data = await this.cepilladoData(year, id);
      if (porcentaje === 1) {
        const porcentajes = calcularPorcentaje(data);
        respuesta[year] = porcentajes;
      } else {
        respuesta[year] = data;
      }
      year--;
    }
    return respuesta;
  }

  async topificacionData(year: number, id: number) {
    const types = ['Si', 'No'];
    const createQuery = (type: string) => {
      const topificacionBoolean = type === 'Si';
      let query = this.consultaORM.createQueryBuilder('consulta').leftJoin('consulta.odontologia', 'odontologia').where('consulta.deshabilitado=false AND odontologia.topificacion = :topificacionBoolean', { topificacionBoolean });
      if (year) {
        query = query.andWhere('EXTRACT(YEAR FROM consulta.created_at) = :year', { year });
      }
      if (id) {
        query = query.andWhere('consulta.id_curso = :id', { id });
      }
      return query.getCount();
    };
    const counts = await Promise.all(
      types.map(async (type) => {
        return await createQuery(type);
      }),
    );
    return counts;
  }

  async porcentajeTopificacionData(year: number, id: number, porcentaje: number) {
    const respuesta = {};
    for (let i = 0; i < 4; i++) {
      const data = await this.topificacionData(year, id);
      if (porcentaje === 1) {
        const porcentajes = calcularPorcentaje(data);
        respuesta[year] = porcentajes;
      } else {
        respuesta[year] = data;
      }
      year--;
    }
    return respuesta;
  }

  async situacionBucalData(year: number, id: number) {
    const types = ['Bajo índice de caries', 'Moderado índice de caries', 'Alto índice de caries', 'Boca sana', 'Sin clasificación'];
    const createQuery = (type: string) => {
      const clasificacion = type;
      let query = this.consultaORM.createQueryBuilder('consulta').leftJoin('consulta.odontologia', 'odontologia').where('consulta.deshabilitado=false AND odontologia.clasificacion = :clasificacion', { clasificacion });
      if (year) {
        query = query.andWhere('EXTRACT(YEAR FROM consulta.created_at) = :year', { year });
      }
      if (id) {
        query = query.andWhere('consulta.id_curso = :id', { id });
      }
      return query.getCount();
    };
    const counts = await Promise.all(
      types.map(async (type) => {
        return await createQuery(type);
      }),
    );
    return counts;
  }

  async porcentajeSituacionBucalData(year: number, id: number, porcentaje: number) {
    const respuesta = {};
    for (let i = 0; i < 4; i++) {
      const data = await this.situacionBucalData(year, id);
      if (porcentaje === 1) {
        const porcentajes = calcularPorcentaje(data);
        respuesta[year] = porcentajes;
      } else {
        respuesta[year] = data;
      }
      year--;
    }
    return respuesta;
  }

  async selladoData(year: number, id: number) {
    const types = ['Si', 'No'];
    const createQuery = (type: string) => {
      let query = this.consultaORM.createQueryBuilder('consulta').leftJoin('consulta.odontologia', 'odontologia').where('consulta.deshabilitado=false ');
      const selladorBolean = type === 'Si';
      if (selladorBolean) {
        query = query.andWhere('odontologia.sellador > 0');
      } else {
        query = query.andWhere('odontologia.sellador = 0');
      }
      if (year) {
        query = query.andWhere('EXTRACT(YEAR FROM consulta.created_at) = :year', { year });
      }
      if (id) {
        query = query.andWhere('consulta.id_curso = :id', { id });
      }
      return query.getCount();
    };
    const counts = await Promise.all(
      types.map(async (type) => {
        return await createQuery(type);
      }),
    );
    return counts;
  }

  async porcentajeSelladoData(year: number, id: number, porcentaje: number) {
    const respuesta = {};
    for (let i = 0; i < 4; i++) {
      const data = await this.selladoData(year, id);
      if (porcentaje === 1) {
        const porcentajes = calcularPorcentaje(data);
        respuesta[year] = porcentajes;
      } else {
        respuesta[year] = data;
      }
      year--;
    }
    return respuesta;
  }

  // !!!!!!!!!! OFTALMOLIGA
  async anteojosData(year: number, id: number) {
    const types = ['Si', 'No'];
    const createQuery = (type: string) => {
      const clasificacion = type === 'Si';
      let query = this.consultaORM.createQueryBuilder('consulta').leftJoin('consulta.oftalmologia', 'oftalmologia').where('consulta.deshabilitado=false AND oftalmologia.anteojos = :clasificacion', { clasificacion });
      if (year) {
        query = query.andWhere('EXTRACT(YEAR FROM consulta.created_at) = :year', { year });
      }
      if (id) {
        query = query.andWhere('consulta.id_curso = :id', { id });
      }
      return query.getCount();
    };
    const counts = await Promise.all(
      types.map(async (type) => {
        return await createQuery(type);
      }),
    );
    return counts;
  }

  async porcentajeAnteojosData(year: number, id: number, porcentaje: number) {
    const respuesta = {};
    for (let i = 0; i < 4; i++) {
      const data = await this.anteojosData(year, id);
      if (porcentaje === 1) {
        const porcentajes = calcularPorcentaje(data);
        respuesta[year] = porcentajes;
      } else {
        respuesta[year] = data;
      }
      year--;
    }
    return respuesta;
  }
  async demandaData(year: number, id: number) {
    const types = ['Control niño sano', 'Docente', 'Familiar', 'Otro'];
    const createQuery = (type: string) => {
      const clasificacion = type;
      let query = this.consultaORM.createQueryBuilder('consulta').leftJoin('consulta.oftalmologia', 'oftalmologia').where('consulta.deshabilitado=false AND oftalmologia.demanda = :clasificacion', { clasificacion });
      if (year) {
        query = query.andWhere('EXTRACT(YEAR FROM consulta.created_at) = :year', { year });
      }
      if (id) {
        query = query.andWhere('consulta.id_curso = :id', { id });
      }
      return query.getCount();
    };
    const counts = await Promise.all(
      types.map(async (type) => {
        return await createQuery(type);
      }),
    );
    return counts;
  }

  async porcentajeDemandaData(year: number, id: number, porcentaje: number) {
    const respuesta = {};
    for (let i = 0; i < 4; i++) {
      const data = await this.demandaData(year, id);
      if (porcentaje === 1) {
        const porcentajes = calcularPorcentaje(data);
        respuesta[year] = porcentajes;
      } else {
        respuesta[year] = data;
      }
      year--;
    }
    return respuesta;
  }
}

function calcularPorcentaje(data: number[]) {
  const total = data.reduce((sum, value) => sum + value, 0);
  const porcentajes = data.map((value) => +((value * 100) / total).toFixed(2));
  return porcentajes;
}
