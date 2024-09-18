import { es_MX, Faker } from '@faker-js/faker';
import { setSeederFactory } from 'typeorm-extension';
import { Usuario } from 'src/usuario/entities/usuario.entity';

const customFaker = new Faker({ locale: es_MX });
let idCounter: number = 1;

export const UsuarioFactory = setSeederFactory(Usuario, () => {
  const usuario = new Usuario();
  usuario.id = idCounter++;
  usuario.nombre = customFaker.person.lastName();
  usuario.apellido = customFaker.person.firstName();
  usuario.email = customFaker.internet.email();
  usuario.contrasenia = customFaker.internet.password();
  usuario.dni = customFaker.number.int({ min: 8, max: 8 });
  usuario.especialidad = customFaker.person.jobArea();
  usuario.fe_nacimiento = customFaker.date.birthdate(); // VER!!!

  return usuario;
});
