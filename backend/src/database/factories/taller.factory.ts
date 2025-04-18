import { faker } from '@faker-js/faker/locale/es';
import { setSeederFactory } from 'typeorm-extension';

import { Taller } from '../../taller/entities/taller.entity';
import { ConjuntoConEnum, DestinatariosEnum, FrecuenciaEnum, TurnoTalleresEnum } from '../../common/const/const';

const recursos = ['Proyector', 'Pizarra', 'Folletos informativos', 'Marcadores', 'Sillas', 'Mesas', 'Equipo de sonido', 'Computadora portátil', 'Extensión eléctrica', 'Botellas de agua'];

export const TallerFactory = setSeederFactory(Taller, async () => {
  const taller = new Taller();

  taller.es_taller = faker.datatype.boolean(0.05);
  taller.nombre = faker.commerce.department();
  taller.fecha = faker.date.between({ from: '2021-01-01T00:00:00.000Z', to: new Date().toISOString() });
  taller.cant_encuentros = faker.number.int({ min: 1, max: 10 });
  taller.duracion = faker.number.int({ min: 1, max: 12 });
  taller.cant_participantes = faker.number.int({ min: 10, max: 100 });
  taller.destinatarios = faker.helpers.arrayElement(DestinatariosEnum);
  taller.recursos = faker.helpers.arrayElement(recursos);
  taller.turno = faker.helpers.arrayElement(TurnoTalleresEnum);
  taller.conjunto_con = faker.helpers.arrayElement(ConjuntoConEnum);
  taller.frecuencia = faker.helpers.arrayElement(FrecuenciaEnum);

  return taller;
});
