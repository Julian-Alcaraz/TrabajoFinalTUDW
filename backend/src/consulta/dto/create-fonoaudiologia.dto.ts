import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty } from 'class-validator';

import { CausasType, DiagnosticoPresuntivoType } from '../entities/fonoaudiologia.entity';

export class CreateFonoaudiologiaDto {
  @ApiProperty({ description: 'Asistencia' })
  @IsNotEmpty({ message: 'La asistencia no puede estar vacia' })
  @IsBoolean({ message: 'La asistencia debe ser un boleano' })
  readonly asistencia: boolean;

  @ApiProperty({ description: 'Diagnostico presuntivo del niño que asiste' })
  @IsNotEmpty({ message: 'El diagnostico presuntivo no puede estar vacio' })
  @IsEnum(['TEL', 'TEA', 'Retraso en el lenguaje, dislalias funcionales', 'Respirador bucal', 'Anquiloglosia', 'Ortodoncia: Protrusión lingual, paladar hendido', 'Síndromes', 'Otras patologías que dificulten el lenguaje y la comunicación'], { message: 'El tipo no es una opcion valida. TEL, TEA, Retraso en el lenguaje, dislalias funcionales, Respirador bucal, Anquiloglosia, Ortodoncia: Protrusión lingual, paladar hendido, Síndromes, Otras patologías que dificulten el lenguaje y la comunicación' })
  readonly diagnostico_presuntivo: DiagnosticoPresuntivoType;

  @ApiProperty({ description: 'Causas del niño que asiste' })
  @IsNotEmpty({ message: 'Causas no puede estar vacio' })
  @IsEnum(['Prenatal', 'Postnatal', 'ACV', 'Respiratorias', 'Audición', 'Patologías clínicas', 'Síndromes', 'Inflamación de amígdalas o adenoides', 'Prematurez', 'Otras'], { message: 'El tipo no es una opcion valida. Prenatal, Postnatal, ACV, Respiratorias, Audición, Patologías clínicas, Síndromes, Inflamación de amígdalas o adenoides, Prematurez, Otras' })
  readonly causas: CausasType;
}
