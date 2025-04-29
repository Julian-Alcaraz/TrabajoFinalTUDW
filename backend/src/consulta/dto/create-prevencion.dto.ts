import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';

import { MotivoConsumoType, MotivoConsumoEnum, FrecuenciaPrevencionType, FrecuenciaPrevencionEnum, ConsumoProblematicoType, ConsumoProblematicoEnum, OtraProblematicaType, OtraProblematicaEnum } from '../../common/const/const';

export class CreatePrevencionDto {
  @ApiProperty({ description: 'Edad inicio de consumo' })
  @IsOptional()
  @IsNotEmpty({ message: 'La edad de inicio de consumo no puede estar vacia' })
  @IsInt({ message: 'La edad de inicio de consumo debe ser un número' })
  @Min(0, { message: 'La edad de incio de consumo debe ser un positivo o cero' })
  readonly edad_inicio_consumo: number;

  @ApiProperty({ description: 'Motivo de consumo del niño que asiste' })
  @IsNotEmpty({ message: 'El motivo de consumo no puede estar vacio' })
  @IsEnum(MotivoConsumoEnum, { message: `No es una opcion válida. Valores permitidos: ${Object.values(MotivoConsumoEnum).join(', ')}` })
  readonly motivo_consumo: MotivoConsumoType;

  @ApiProperty({ description: 'Frecuencia de consumo del niño que asiste' })
  @IsNotEmpty({ message: 'Frecuencia de consumo no puede estar vacio' })
  @IsEnum(FrecuenciaPrevencionEnum, { message: `No es una opcion válida. Valores permitidos: ${Object.values(FrecuenciaPrevencionEnum).join(', ')}` })
  readonly frecuencia: FrecuenciaPrevencionType;

  @ApiProperty({ description: 'Consumo problematico del niño que asiste' })
  @IsNotEmpty({ message: 'Consumo problematico  no puede estar vacio' })
  @IsEnum(ConsumoProblematicoEnum, { message: `No es una opcion válida. Valores permitidos: ${Object.values(ConsumoProblematicoEnum).join(', ')}` })
  readonly consumo_problematico: ConsumoProblematicoType;

  @ApiProperty({ description: 'Consumo problematico del niño que asiste' })
  @IsNotEmpty({ message: 'Consumo problematico  no puede estar vacio' })
  @IsEnum(OtraProblematicaEnum, { message: `No es una opcion válida. Valores permitidos: ${Object.values(OtraProblematicaEnum).join(', ')}` })
  readonly otra_problematica: OtraProblematicaType;
}
