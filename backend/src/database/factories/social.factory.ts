import { faker } from '@faker-js/faker/locale/es';
import { setSeederFactory } from 'typeorm-extension';

import { Social } from '../../consulta/entities/social.entity';

export const SocialFactory = setSeederFactory(Social, async () => {
  const social = new Social();
  social.articulacion = faker.string.alpha(50);
  social.demanda = faker.string.alpha(50);
  social.objeto_informe = faker.string.alpha(50);
  social.seguimiento = faker.string.alpha(50);

  return social;
});
