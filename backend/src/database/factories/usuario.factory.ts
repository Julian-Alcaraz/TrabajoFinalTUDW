import { faker } from '@faker-js/faker/locale/es';
import { setSeederFactory } from 'typeorm-extension';
import { Usuario } from '../../usuario/entities/usuario.entity';

export const UsuarioFactory = setSeederFactory(Usuario, async () => {
  const usuario = new Usuario();
  usuario.nombre = faker.person.firstName();
  usuario.apellido = faker.person.lastName();
  usuario.email = faker.internet.email();
  usuario.contrasenia = faker.internet.password();
  usuario.dni = faker.number.int({ min: 10000000, max: 99999999 });
  usuario.fe_nacimiento = faker.date.between({ from: '1950-01-01T00:00:00.000Z', to: '2024-01-01T00:00:00.000Z' });
  return usuario;
});
