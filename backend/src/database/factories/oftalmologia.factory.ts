import { faker } from '@faker-js/faker/locale/es';
import { setSeederFactory } from 'typeorm-extension';

import { Oftalmologia } from '../../consulta/entities/oftalmologia.entity';

export const OftalmologiaFactory = setSeederFactory(Oftalmologia, async () => {
  const oftalmologia = new Oftalmologia();
  const demandaOptions = ['Familiar', 'Docente', 'Control Niño Sano'];
  oftalmologia.demanda = faker.helpers.arrayElement(demandaOptions);
  oftalmologia.prox_control = faker.date.future({ years: 1 });
  oftalmologia.receta = Math.random() > 0.5 ? true : false;
  oftalmologia.primera_vez = Math.random() > 0.5 ? true : false;
  if (!oftalmologia.primera_vez) oftalmologia.control = true;
  else oftalmologia.control = false;
  if (oftalmologia.primera_vez === false && oftalmologia.control === true) {
    oftalmologia.anteojos = Math.random() > 0.5 ? true : false;
  } else {
    oftalmologia.anteojos = null;
  }
  return oftalmologia;
});
