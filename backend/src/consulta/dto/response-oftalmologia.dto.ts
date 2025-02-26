import { Transform } from 'class-transformer';
import { DemandaEnum } from '../entities/oftalmologia.entity';
import { DateTime } from 'luxon';

export class ResponseOftalmologiaDto {
  @Transform(({ value }) => (value ? DateTime.fromISO(value, { zone: 'utc' }).toFormat('dd-MM-yyyy') : null))
  readonly prox_control: Date;

  readonly demanda: DemandaEnum;
  readonly primera_vez: boolean;
  readonly control: boolean;
  readonly receta: boolean;
  readonly anteojos?: boolean;
}
