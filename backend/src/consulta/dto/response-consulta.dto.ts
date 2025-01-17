import { Transform } from 'class-transformer';
import { DateTime } from 'luxon';

import { ConsultaType, DerivacionesType, TurnoType } from '../entities/consulta.entity';
import { CreateClinicaDto } from './create-clinica.dto';
import { CreateFonoaudiologiaDto } from './create-fonoaudiologia.dto';
import { CreateOftalmologiaDto } from './create-oftalmologia.dto';
import { CreateOdontologiaDto } from './create-odontologia.dto';

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
  readonly derivaciones: DerivacionesType;
  readonly observaciones?: string;

  public clinica?: CreateClinicaDto;
  public fonoaudiologia?: CreateFonoaudiologiaDto;
  public oftalmologia?: CreateOftalmologiaDto;
  public odontologia?: CreateOdontologiaDto;
}
