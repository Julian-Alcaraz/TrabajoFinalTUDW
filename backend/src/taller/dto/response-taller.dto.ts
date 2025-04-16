import { Transform } from 'class-transformer';
import { DateTime } from 'luxon';

export class ResponseTallerDto {
  @Transform(({ value }) => (value ? DateTime.fromISO(value, { zone: 'utc' }).toFormat('dd-MM-yyyy') : null))
  readonly fecha: Date;
}
