import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';
import { Transform } from 'class-transformer';

import { NivelCursoType, NivelCursoEnum } from '../../common/const/const';

export class CreateCursoDto {
  @ApiProperty({ description: 'Nivel del chico' })
  @IsNotEmpty({ message: 'El Nivel no puede estar vacio' })
  @IsEnum(NivelCursoEnum, { message: `No es un nivel válido. Valores permitidos: ${Object.values(NivelCursoEnum).join(', ')}` })
  readonly nivel: NivelCursoType;

  @ApiProperty({ description: 'Nombre del curso' })
  @IsNotEmpty({ message: 'El nombre no puede estar vacio' })
  @IsString({ message: 'El nombre debe ser un string' })
  @Length(1, 50, { message: 'El nombre debe tener entre 1 y 50 caracteres' })
  @Transform(({ value }) => value.trim())
  readonly nombre: string;
}
