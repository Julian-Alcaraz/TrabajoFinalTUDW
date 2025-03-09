import { Transform } from 'class-transformer';
import { DateTime } from 'luxon';

import { DemandaType } from '../../common/const/const';

export class ResponseOftalmologiaDto {
  @Transform(({ value }) => (value ? DateTime.fromISO(value, { zone: 'utc' }).toFormat('dd-MM-yyyy') : null))
  readonly prox_control: Date;

  readonly demanda: DemandaType;
  readonly primera_vez: boolean;
  readonly control: boolean;
  readonly receta: boolean;
  readonly anteojos?: boolean;
}
