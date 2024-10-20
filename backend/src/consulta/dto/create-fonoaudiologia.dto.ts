import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateFonoaudiologiaDto {
  @ApiProperty({ description: 'Asistencia' })
  @IsNotEmpty({ message: 'La asistencia no puede estar vacia' })
  @IsBoolean({ message: 'La asistencia debe ser un boleano' })
  readonly asistencia: boolean;

  @ApiProperty({ description: 'Diagnostico presuntivo del niño que asiste' })
  @IsNotEmpty({ message: 'El diagnostico presuntivo no puede estar vacio' })
  @IsString({ message: 'El diagnostico presuntivo debe ser un string' })
  @Length(1, 100, { message: 'El diagnostico presuntivo debe tener entre 1 y 100 caracteres' })
  readonly diagnosticoPresuntivo: string;

  @ApiProperty({ description: 'Causas del niño que asiste' })
  @IsNotEmpty({ message: 'Causas no puede estar vacio' })
  @IsString({ message: 'Causas debe ser un string' })
  @Length(1, 100, { message: 'Causas debe tener entre 1 y 100 caracteres' })
  readonly causas: string;
}
