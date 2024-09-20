import * as bcrypt from 'bcrypt';

export function codificarContrasenia(contrasenia: string) {
  const SALT = bcrypt.genSaltSync();
  return bcrypt.hashSync(contrasenia, SALT);
}

export function compararContrasenias(contrasenia: string, hash: string) {
  return bcrypt.compareSync(contrasenia, hash);
}
