import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty } from 'class-validator';

import { CausasType, CausasEnum, DiagnosticoPresuntivoType, DiagnosticoPresuntivoEnum } from '../../common/const/const';

export class CreateFonoaudiologiaDto {
  @ApiProperty({ description: 'Asistencia' })
  @IsNotEmpty({ message: 'La asistencia no puede estar vacia' })
  @IsBoolean({ message: 'La asistencia debe ser un boleano' })
  readonly asistencia: boolean;

  @ApiProperty({ description: 'Diagnostico presuntivo del niño que asiste' })
  @IsNotEmpty({ message: 'El diagnostico presuntivo no puede estar vacio' })
  @IsEnum(DiagnosticoPresuntivoEnum, { message: `No es una opcion válida. Valores permitidos: ${Object.values(DiagnosticoPresuntivoEnum).join(', ')}` })
  readonly diagnostico_presuntivo: DiagnosticoPresuntivoType;

  @ApiProperty({ description: 'Causas del niño que asiste' })
  @IsNotEmpty({ message: 'Causas no puede estar vacio' })
  @IsEnum(CausasEnum, { message: `No es una opcion válida. Valores permitidos: ${Object.values(CausasEnum).join(', ')}` })
  readonly causas: CausasType;
}
