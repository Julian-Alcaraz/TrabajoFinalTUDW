import { faker } from '@faker-js/faker/locale/es_MX';
import { setSeederFactory } from 'typeorm-extension';

import { Rol } from '../../rol/entities/rol.entity';
// NO SE USA
export const RolFactory = setSeederFactory(Rol, async () => {
  const rol = new Rol();
  rol.nombre = faker.word.noun();
  return rol;
});
