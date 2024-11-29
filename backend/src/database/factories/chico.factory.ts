import { faker } from '@faker-js/faker/locale/es';
import { setSeederFactory } from 'typeorm-extension';

import { Chico } from '../../chico/entities/chico.entity';

export const ChicoFactory = setSeederFactory(Chico, async () => {
  const chico = new Chico();
  chico.dni = faker.number.int({ min: 10000000, max: 99999999 });
  chico.fe_nacimiento = faker.date.between({ from: '2006-01-01T00:00:00.000Z', to: '2024-01-01T00:00:00.000Z' });
  chico.nombre_padre = Math.random() > 0.5 ? faker.person.fullName() : null;
  chico.nombre_madre = Math.random() > 0.5 ? faker.person.fullName() : null;
  chico.direccion = faker.location.streetAddress();
  chico.telefono = faker.phone.number().replace(/[.\s-]+/g, '');
  enum sexoType {
    Masculino = 'Masculino',
    Femenino = 'Femenino',
  }
  const sexoFaker = faker.person.sex();
  chico.sexo = sexoFaker === 'male' ? sexoType.Masculino : sexoType.Femenino;
  chico.nombre = faker.person.firstName(sexoFaker === 'male' ? 'male' : 'female');
  chico.apellido = faker.person.lastName(sexoFaker === 'male' ? 'male' : 'female');
  chico.created_at = faker.date.between({ from: '2021-01-01T00:00:00.000Z', to: '2024-12-31T00:00:00.000Z' });

  return chico;
});
