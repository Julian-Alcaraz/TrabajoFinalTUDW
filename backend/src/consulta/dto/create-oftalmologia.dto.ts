import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

import { DemandaType, DemandaEnum } from '../../common/const/const';

export class CreateOftalmologiaDto {
  @ApiProperty({ description: 'Demanada de la consulta' })
  @IsNotEmpty({ message: 'La demanda no puede estar vacia' })
  @IsEnum(DemandaEnum, { message: `No es una opcion válida. Valores permitidos: ${Object.values(DemandaEnum).join(', ')}` })
  readonly demanda: DemandaType;

  @ApiProperty({ description: 'Primera vez' })
  @IsNotEmpty({ message: 'Primera vez no puede estar vacia' })
  @IsBoolean({ message: 'Primera vez debe ser un boleano' })
  readonly primera_vez: boolean;

  @ApiProperty({ description: 'Control' })
  @IsNotEmpty({ message: 'Control no puede estar vacia' })
  @IsBoolean({ message: 'Control debe ser un boleano' })
  readonly control: boolean;

  @ApiProperty({ description: 'Receta' })
  @IsNotEmpty({ message: 'Receta no puede estar vacia' })
  @IsBoolean({ message: 'Receta debe ser un boleano' })
  readonly receta: boolean;

  @ApiProperty({ description: 'Fecha proximo control del chico.' })
  @IsNotEmpty({ message: 'La fecha del proximo control no puede estar vacia' })
  @Type(() => Date)
  @IsDate({ message: 'La fecha del proximo control no tiene formato correcto' })
  readonly prox_control: Date;

  @ApiProperty({ description: 'Indica si se le entregaron los anteojos al chico o no' })
  @IsBoolean({ message: 'Anteojos debe ser un boleano' })
  @IsOptional()
  readonly anteojos?: boolean;
}
