import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

import { OpcionesEspecialidadType, OpcionesEspecialidadEnum } from '../../common/const/const';

export class CreateEspecialidadDto {
  @ApiProperty({ description: 'Nombre de la especialidad' })
  @IsNotEmpty({ message: 'El nombre de la especialidad no puede estar vacio' })
  @IsEnum(OpcionesEspecialidadEnum, { message: `No es una opcion válida. Valores permitidos: ${Object.values(OpcionesEspecialidadEnum).join(', ')}` })
  readonly nombre: OpcionesEspecialidadType;
}
