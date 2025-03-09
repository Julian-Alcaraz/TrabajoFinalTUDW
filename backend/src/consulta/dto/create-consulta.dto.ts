import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, Length, ValidateIf, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';

import { ConsultaType, ConsultaEnum, TurnoType, TurnoEnum } from '../../common/const/const';
import { CreateClinicaDto } from './create-clinica.dto';
import { CreateFonoaudiologiaDto } from './create-fonoaudiologia.dto';
import { CreateOftalmologiaDto } from './create-oftalmologia.dto';
import { CreateOdontologiaDto } from './create-odontologia.dto';

export class CreateConsultaDto {
  @ApiProperty({ description: 'Tipo de consulta' })
  @IsNotEmpty({ message: 'El tipo no puede estar vacio' })
  @IsEnum(ConsultaEnum, { message: `No es una opcion válida. Valores permitidos: ${Object.values(ConsultaEnum).join(', ')}` })
  readonly type: ConsultaType;

  @ApiProperty({ description: 'Turno al que va el chico que asiste a la consulta' })
  @IsNotEmpty({ message: 'El turno no puede estar vacio' })
  @IsEnum(TurnoEnum, { message: `No es una opcion válida. Valores permitidos: ${Object.values(TurnoEnum).join(', ')}` })
  readonly turno: TurnoType;

  @ApiProperty({ description: 'Obra social de la consulta' })
  @IsNotEmpty({ message: 'La obra social no puede estar vacio' })
  @IsBoolean({ message: 'La obra social debe ser un boolean' })
  readonly obra_social: boolean;

  @ApiProperty({ description: 'Edad del niño que asiste' })
  @IsNotEmpty({ message: 'La edad no puede estar vacia' })
  @IsInt({ message: 'La edad debe ser un número' })
  @IsPositive({ message: 'La edad debe ser un numero positivo' })
  readonly edad: number;

  @ApiProperty({ description: 'El id del niño que va a la consulta' })
  @IsNotEmpty({ message: 'El id del niño no puede estar vacio' })
  @IsInt({ message: 'El id del niño debe ser un número' })
  @IsPositive({ message: 'El id del niño debe ser un numero positivo' })
  readonly id_chico: number;

  @ApiProperty({ description: 'La institucion a la que va el niño' })
  @IsNotEmpty({ message: 'El id de la institucion no puede estar vacio' })
  @IsInt({ message: 'El id de la institucion debe ser un número' })
  @IsPositive({ message: 'El id de la institucion debe ser un numero positivo' })
  readonly id_institucion: number;

  @ApiProperty({ description: 'El curso al que va el niño' })
  @IsNotEmpty({ message: 'El id del curso no puede estar vacio' })
  @IsInt({ message: 'El id del curso debe ser un número' })
  @IsPositive({ message: 'El id del curso debe ser un numero positivo' })
  readonly id_curso: number;

  @ApiProperty({ description: 'Derivacion oftalmologia de la consulta' })
  @IsNotEmpty({ message: 'La derivacion oftalmologia no puede estar vacio' })
  @IsBoolean({ message: 'La derivacion oftalmologia debe ser un boolean' })
  readonly derivacion_oftalmologia: boolean;

  @ApiProperty({ description: 'Derivacion odontologia de la consulta' })
  @IsNotEmpty({ message: 'La derivacion odontologia no puede estar vacio' })
  @IsBoolean({ message: 'La derivacion odontologia debe ser un boolean' })
  readonly derivacion_odontologia: boolean;

  @ApiProperty({ description: 'Derivacion fonoaudiologia de la consulta' })
  @IsNotEmpty({ message: 'La derivacion fonoaudiologia no puede estar vacio' })
  @IsBoolean({ message: 'La derivacion fonoaudiologia debe ser un boolean' })
  readonly derivacion_fonoaudiologia: boolean;

  @ApiProperty({ description: 'Derivacion externa de la consulta' })
  @IsNotEmpty({ message: 'La derivacion externa no puede estar vacio' })
  @IsBoolean({ message: 'La derivacion externa debe ser un boolean' })
  readonly derivacion_externa: boolean;

  @ApiProperty({ description: 'Observaciones de la consulta' })
  @IsString({ message: 'Las Observaciones debe ser un string' })
  @Length(1, 1000, { message: 'Las Observaciones deben tener entre 1 y 1000 caracteres' })
  @IsOptional()
  @Transform(({ value }) => (value ? value.trim() : value))
  readonly observaciones?: string;

  // Validación condicional para "Clinica"
  @ValidateIf((o) => o.type === 'Clinica')
  @IsNotEmpty({ message: 'Los datos de la clínica no pueden estar vacíos cuando el tipo es Clínica' })
  @ValidateNested()
  @Type(() => CreateClinicaDto)
  public clinica?: CreateClinicaDto;

  // Validación condicional para "Fonoaudiologia"
  @ValidateIf((o) => o.type === 'Fonoaudiologia')
  @IsNotEmpty({ message: 'Los datos de fonoaudiología no pueden estar vacíos cuando el tipo es Fonoaudiología' })
  @ValidateNested()
  @Type(() => CreateFonoaudiologiaDto)
  public fonoaudiologia?: CreateFonoaudiologiaDto;

  // Validación condicional para "Oftalmologia"
  @ValidateIf((o) => o.type === 'Oftalmologia')
  @IsNotEmpty({ message: 'Los datos de oftalmología no pueden estar vacíos cuando el tipo es Oftalmología' })
  @ValidateNested()
  @Type(() => CreateOftalmologiaDto)
  public oftalmologia?: CreateOftalmologiaDto;

  // Validación condicional para "Odontologia"
  @ValidateIf((o) => o.type === 'Odontologia')
  @IsNotEmpty({ message: 'Los datos de odontología no pueden estar vacíos cuando el tipo es Odontología' })
  @ValidateNested()
  @Type(() => CreateOdontologiaDto)
  public odontologia?: CreateOdontologiaDto;
}
