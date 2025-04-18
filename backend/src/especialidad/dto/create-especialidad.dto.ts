import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

import { EspecialidadType, EspecialidadEnum } from '../../common/const/const';

export class CreateEspecialidadDto {
  @ApiProperty({ description: 'Nombre de la especialidad' })
  @IsNotEmpty({ message: 'El nombre de la especialidad no puede estar vacio' })
  @IsEnum(EspecialidadEnum, { message: `No es una opcion válida. Valores permitidos: ${Object.values(EspecialidadEnum).join(', ')}` })
  readonly nombre: EspecialidadType;
}
