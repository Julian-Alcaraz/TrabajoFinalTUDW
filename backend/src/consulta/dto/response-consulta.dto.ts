import { Transform, Type } from 'class-transformer';
import { DateTime } from 'luxon';

import { ConsultaType, TurnoType } from '../entities/consulta.entity';
import { CreateClinicaDto } from './create-clinica.dto';
import { CreateFonoaudiologiaDto } from './create-fonoaudiologia.dto';
import { CreateOdontologiaDto } from './create-odontologia.dto';
import { ResponseOftalmologiaDto } from './response-oftalmologia.dto';

export class ResponseConsultaDto {
  @Transform(({ value }) => (value ? DateTime.fromISO(value.toISOString().slice(0, 10), { zone: 'utc' }).toFormat('dd-MM-yyyy') : null))
  readonly created_at: string;

  readonly type: ConsultaType;
  readonly turno: TurnoType;
  readonly obra_social: boolean;
  readonly edad: number;
  readonly id_chico: number;
  readonly id_institucion: number;
  readonly id_curso: number;
  readonly derivacion_oftalmologia: boolean;
  readonly derivacion_odontologia: boolean;
  readonly derivacion_fonoaudiologia: boolean;
  readonly derivacion_externa: boolean;
  readonly observaciones?: string;

  @Type(() => ResponseOftalmologiaDto)
  public oftalmologia?: ResponseOftalmologiaDto;
  public clinica?: CreateClinicaDto;
  public fonoaudiologia?: CreateFonoaudiologiaDto;
  public odontologia?: CreateOdontologiaDto;
}
