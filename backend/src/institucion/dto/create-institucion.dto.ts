import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';
import { Transform } from 'class-transformer';

import { TipoInstitucionType, TipoInstitucionEnum } from '../../common/const/const';

export class CreateInstitucionDto {
  @ApiProperty({ description: 'Nombre de la insititucion' })
  @IsNotEmpty({ message: 'El nombre no puede estar vacio' })
  @IsString({ message: 'El nombre debe ser un string' })
  @Length(1, 100, { message: 'El nombre debe tener entre 1 y 100 caracteres' })
  @Transform(({ value }) => value.trim())
  readonly nombre: string;

  @ApiProperty({ description: 'Tipo de insititucion' })
  @IsNotEmpty({ message: 'El tipo de institución no puede estar vacio' })
  @IsEnum(TipoInstitucionEnum, { message: `No es un nivel valido. Valores permitidos: ${Object.values(TipoInstitucionEnum).join(', ')}` })
  readonly tipo: TipoInstitucionType;
}
