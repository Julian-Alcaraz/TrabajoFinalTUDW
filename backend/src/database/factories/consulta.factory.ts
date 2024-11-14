import { faker } from '@faker-js/faker/locale/es';
import { setSeederFactory } from 'typeorm-extension';

import { Consulta } from '../../consulta/entities/consulta.entity';

type DerivacionesType = {
  odontologia: boolean;
  oftalmologia: boolean;
  fonoaudiologia: boolean;
  externa: boolean;
};

enum TurnoType {
  Mañana = 'Mañana',
  Tarde = 'Tarde',
  Noche = 'Noche',
}

enum ConsultaType {
  Clinica = 'Clinica',
  Fonoaudiologia = 'Fonoaudiologia',
  Oftalmologia = 'Oftalmologia',
  Odontologia = 'Odontologia',
}

export const ConsultaFactory = setSeederFactory(Consulta, async () => {
  const consulta = new Consulta();
  consulta.obra_social = Math.random() > 0.5 ? true : false;
  const turnos = [TurnoType.Mañana, TurnoType.Tarde, TurnoType.Noche];
  consulta.turno = turnos[Math.floor(Math.random() * turnos.length)];
  // consulta.observaciones = Math.random() > 0.5 ? 'OBSERVACIONES DE LA CONSULTA' : null;
  consulta.observaciones = Math.random() > 0.5 ? faker.word.words({ count: { min: 50, max: 1000 } }) : null;
  const types = [ConsultaType.Clinica, ConsultaType.Fonoaudiologia, ConsultaType.Oftalmologia, ConsultaType.Odontologia];
  consulta.type = types[Math.floor(Math.random() * types.length)];
  const derivaciones: DerivacionesType = {
    odontologia: Math.random() > 0.5,
    oftalmologia: Math.random() > 0.5,
    fonoaudiologia: Math.random() > 0.5,
    externa: Math.random() > 0.5,
  };
  consulta.derivaciones = derivaciones;
  return consulta;
});
