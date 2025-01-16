import { Exclude, Transform } from 'class-transformer';
import { DateTime } from 'luxon';

export class ResponseUsuarioDto {
  @Transform(({ value }) => (value ? DateTime.fromISO(value, { zone: 'utc' }).toFormat('dd-MM-yyyy') : null))
  readonly fe_nacimiento: Date;

  // Exclude para no enviar contraseña
  @Exclude()
  contrasenia: string;

  readonly nombre: string;
  readonly apellido: string;
  readonly dni: number;
  readonly email: string;
  readonly roles_ids: number[];
}
