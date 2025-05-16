import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Consulta } from './entities/consulta.entity';
import * as Constantes from '../common/const/const';

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
    const types = Constantes.typeConsultasEnum;
    const respuesta = {};
    for (let i = 0; i < 4; i++) {
      const counts = await Promise.all(types.map((type) => this.consultaORM.createQueryBuilder('consulta').where('consulta.deshabilitado=false AND EXTRACT(YEAR FROM consulta.created_at) = :year AND consulta.type = :type', { year, type }).getCount()));
      respuesta[year] = counts;
      year--;
    }
    return respuesta;
  }
  async countTypeByYearAndInstitucion(year: number, id_institucion: number) {
    const types = Constantes.typeConsultasEnum;
    // const types = ['Clinica', 'Odontologia', 'Oftalmologia', 'Fonoaudiologia', 'Prevencion', 'Social'];
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

  // CLINICA
  async tensionxEstadoData(year: number, id: number, estado: string) {
    const types = Constantes.TensionArterialEnum;
    const createQuery = (type: string) => {
      let query = this.consultaORM.createQueryBuilder('consulta').leftJoin('consulta.clinica', 'clinica').where('consulta.deshabilitado=false').andWhere('clinica.es_clinica = true').andWhere('clinica.estado_nutricional = :estado AND clinica.tension_arterial = :type', { estado, type });
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
    const types = Constantes.EstadoNutricionalEnum;
    // const types = ['B Bajo peso/Desnutrido', 'A Riesgo Nutricional', 'C Eutrófico', 'D Sobrepeso', 'E Obesidad'];
    const createQuery = (type: string) => {
      let query = this.consultaORM.createQueryBuilder('consulta').leftJoin('consulta.clinica', 'clinica').where('consulta.deshabilitado=false AND clinica.es_clinica = true AND clinica.estado_nutricional = :type', { type });
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
    const types = Constantes.TensionArterialEnum;
    // const types = ['Normotenso', 'Riesgo', 'Hipertenso'];
    const createQuery = (type: string) => {
      let query = this.consultaORM.createQueryBuilder('consulta').leftJoin('consulta.clinica', 'clinica').where('consulta.deshabilitado=false AND clinica.es_clinica = true AND clinica.tension_arterial = :type', { type });
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
    const types = Constantes.ExamenVisualEnum;
    // const types = ['Normal', 'Anormal'];
    const createQuery = (type: string) => {
      let query = this.consultaORM.createQueryBuilder('consulta').leftJoin('consulta.clinica', 'clinica').where('consulta.deshabilitado=false AND clinica.es_clinica = true AND clinica.examen_visual = :type', { type });
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
    const types = Constantes.VacunasEnum;
    // const types = ['Completo', 'Incompleto', 'Desconocido'];
    const createQuery = (type: string) => {
      let query = this.consultaORM.createQueryBuilder('consulta').leftJoin('consulta.clinica', 'clinica').where('consulta.deshabilitado=false AND clinica.es_clinica = true AND clinica.vacunas = :type', { type });
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
    const types = Constantes.OrtopediaYTraumatologiaEnum;
    // const types = ['Normal', 'Anormal'];
    const createQuery = (type: string) => {
      let query = this.consultaORM.createQueryBuilder('consulta').where('consulta.deshabilitado=false').leftJoin('consulta.clinica', 'clinica');
      if (type === 'Normal') {
        query.andWhere('clinica.ortopedia_traumatologia = :ortopedia', { ortopedia: 'Normal' }).andWhere('clinica.es_clinica = true');
      } else if (type === 'Anormal') {
        query.andWhere('clinica.ortopedia_traumatologia != :ortopedia', { ortopedia: 'Normal' }).andWhere('clinica.es_clinica = true');
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
    const types = Constantes.LenguajeEnum;
    // const types = ['Adecuado', 'Inadecuado'];
    const createQuery = (type: string) => {
      let query = this.consultaORM.createQueryBuilder('consulta').leftJoin('consulta.clinica', 'clinica').where('consulta.deshabilitado=false AND clinica.es_clinica = true AND clinica.lenguaje = :type', { type });
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
    const types = [0, 1, 2, 3, 4, 5];
    const createQuery = (type: number) => {
      // const cepilladoBoolean = type === 'Si';
      let query = this.consultaORM.createQueryBuilder('consulta').leftJoin('consulta.odontologia', 'odontologia').where('consulta.deshabilitado=false AND odontologia.cant_cepillado = :type', { type });
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
    const types = Constantes.DemandaEnum;
    // const types = ['Control niño sano', 'Docente', 'Familiar', 'Otro'];
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

  // FONOAUDIOLOGIA
  async diagnosticoPresuntivo(year: number, id: number) {
    const types = Constantes.DiagnosticoPresuntivoEnum;
    // const types = ['TEL', 'TEA', 'Retraso en el lenguaje, dislalias funcionales', 'Respirador bucal', 'Anquiloglosia', 'Ortodoncia: Protrusión lingual, paladar hendido', 'Síndromes', 'Otras patologías que dificulten el lenguaje y la comunicación'] as const;

    const createQuery = (type: string) => {
      const clasificacion = type;
      let query = this.consultaORM.createQueryBuilder('consulta').leftJoin('consulta.fonoaudiologia', 'fonoaudiologia').where('consulta.deshabilitado=false AND fonoaudiologia.diagnostico_presuntivo = :clasificacion', { clasificacion });
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
  async porcentajeDiagnosticoPresuntivo(year: number, id: number, porcentaje: number) {
    const respuesta = {};
    for (let i = 0; i < 4; i++) {
      const data = await this.diagnosticoPresuntivo(year, id);
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
  async causas(year: number, id: number) {
    const types = Constantes.CausasEnum;
    // const types = ['Prenatal', 'Postnatal', 'ACV', 'Respiratorias', 'Audición', 'Patologías clínicas', 'Síndromes', 'Inflamación de amígdalas o adenoides', 'Prematurez', 'Otras'] as const;

    const createQuery = (type: string) => {
      const clasificacion = type;
      let query = this.consultaORM.createQueryBuilder('consulta').leftJoin('consulta.fonoaudiologia', 'fonoaudiologia').where('consulta.deshabilitado=false AND fonoaudiologia.causas = :clasificacion', { clasificacion });
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
  async porcentajeCausas(year: number, id: number, porcentaje: number) {
    const respuesta = {};
    for (let i = 0; i < 4; i++) {
      const data = await this.causas(year, id);
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
  // PREVENCION
  async problematica(year: number, id: number) {
    const types = Constantes.OtraProblematicaEnum;
    // const types = ['Consumo problematico', 'Bajo rendimiento', 'Violencia familiar', 'Depresion', 'Bullying', 'Otra'];
    const createQuery = (type: string) => {
      const clasificacion = type;
      let query = this.consultaORM.createQueryBuilder('consulta').leftJoin('consulta.prevencion', 'prevencion').where('consulta.deshabilitado=false AND prevencion.otra_problematica = :clasificacion', { clasificacion });
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
  async porcentajeProblematica(year: number, id: number, porcentaje: number) {
    const respuesta = {};
    for (let i = 0; i < 4; i++) {
      const data = await this.problematica(year, id);
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

  // cosumo problematico
  async drogasHabituales(year: number, id: number) {
    const types = Constantes.ConsumoProblematicoEnum;
    // const types = ['Alchol', 'Marihuana', 'Cocaina', 'Tabaco', 'Otra'];
    const createQuery = (type: string) => {
      const clasificacion = type;
      const consumo = 'Consumo problematico';
      let query = this.consultaORM.createQueryBuilder('consulta').leftJoin('consulta.prevencion', 'prevencion').where('consulta.deshabilitado=false AND prevencion.otra_problematica = :consumo AND prevencion.consumo_problematico = :clasificacion', { consumo, clasificacion });
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
  async porcentajeDrogasHabituales(year: number, id: number, porcentaje: number) {
    const respuesta = {};
    for (let i = 0; i < 4; i++) {
      const data = await this.drogasHabituales(year, id);
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
  // frecuencia consumo
  async frecuenciaConsumo(year: number, id: number) {
    const types = Constantes.FrecuenciaPrevencionEnum;
    // const types = ['Todos los dias', '2 veces por semana', '3 veces por semana', 'Fines de semana', 'Exporadico', 'Otro'];
    const createQuery = (type: string) => {
      const clasificacion = type;
      const consumo = 'Consumo problematico';
      let query = this.consultaORM.createQueryBuilder('consulta').leftJoin('consulta.prevencion', 'prevencion').where('consulta.deshabilitado=false AND prevencion.otra_problematica = :consumo AND prevencion.frecuencia = :clasificacion', { consumo, clasificacion });
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
  async porcentajeFrecuenciaConsumo(year: number, id: number, porcentaje: number) {
    const respuesta = {};
    for (let i = 0; i < 4; i++) {
      const data = await this.frecuenciaConsumo(year, id);
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
  // motivo consumo
  async motivoConsumo(year: number, id: number) {
    const types = Constantes.MotivoConsumoEnum;
    // const types = ['Curiosidad', 'Presion de grupo', 'Ritos Familiar', 'Otro'];
    const createQuery = (type: string) => {
      const clasificacion = type;
      const consumo = 'Consumo problematico';

      let query = this.consultaORM.createQueryBuilder('consulta').leftJoin('consulta.prevencion', 'prevencion').where('consulta.deshabilitado=false AND prevencion.otra_problematica = :consumo AND prevencion.motivo_consumo = :clasificacion', { consumo, clasificacion });
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
  async porcentajeMotivoConsumo(year: number, id: number, porcentaje: number) {
    const respuesta = {};
    for (let i = 0; i < 4; i++) {
      const data = await this.motivoConsumo(year, id);
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
  // TRABAJO SOCIAL
}

function calcularPorcentaje(data: number[]) {
  const total = data.reduce((sum, value) => sum + value, 0);
  const porcentajes = data.map((value) => +((value * 100) / total).toFixed(2));
  return porcentajes;
}
