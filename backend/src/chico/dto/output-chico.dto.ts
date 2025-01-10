import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { lightFormat } from 'date-fns';

import { sexoType } from '../entities/chico.entity';

export class OutputChicoDto {
  @ApiProperty({ description: 'Dni del chico' })
  readonly dni: number;

  @ApiProperty({ description: 'Nombre del chico' })
  readonly nombre: string;

  @ApiProperty({ description: 'Apellido del chico' })
  readonly apellido: string;

  @ApiProperty({ description: 'Sexo del chico' })
  readonly sexo: sexoType;

  @ApiProperty({ description: 'Fecha nacimiento del chico' })
  @Transform(({ value }) => (value ? lightFormat(new Date(value), 'dd-MM-yyyy') : null))
  readonly fe_nacimiento: string;

  @ApiProperty({ description: 'Direccion del chico' })
  readonly direccion: string;

  @ApiProperty({ description: 'Telefono del chico' })
  readonly telefono: string;

  @ApiProperty({ description: 'Nombre madre del chico' })
  @IsOptional()
  readonly nombre_madre?: string;

  @ApiProperty({ description: 'Nombre padre del chico' })
  @IsOptional()
  readonly nombre_padre?: string;

  @ApiProperty({ description: 'Id del barrio' })
  readonly id_barrio: number;
}
