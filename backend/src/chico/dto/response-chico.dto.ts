import { Transform } from 'class-transformer';
import { DateTime } from 'luxon';

import { sexoType } from '../entities/chico.entity';

export class ResponseChicoDto {
  @Transform(({ value }) => (value ? DateTime.fromISO(value, { zone: 'utc' }).toFormat('dd-MM-yyyy') : null))
  readonly fe_nacimiento: string;

  readonly dni: number;
  readonly nombre: string;
  readonly apellido: string;
  readonly sexo: sexoType;
  readonly direccion: string;
  readonly telefono: string;
  readonly id_barrio: number;
  readonly nombre_madre?: string;
  readonly nombre_padre?: string;
}
