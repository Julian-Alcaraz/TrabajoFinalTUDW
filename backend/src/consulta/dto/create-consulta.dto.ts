import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsObject, IsOptional, IsPositive, IsString, Length, ValidateIf, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';

import { ConsultaType, DerivacionesType, TurnoType } from '../entities/consulta.entity';
import { CreateClinicaDto } from './create-clinica.dto';
import { CreateFonoaudiologiaDto } from './create-fonoaudiologia.dto';
import { CreateOftalmologiaDto } from './create-oftalmologia.dto';
import { CreateOdontologiaDto } from './create-odontologia.dto';
import { DerivacionesDto } from './derivaciones.dto';

export class CreateConsultaDto {
  @ApiProperty({ description: 'Tipo de consulta' })
  @IsNotEmpty({ message: 'El tipo no puede estar vacio' })
  @IsEnum(['Clinica', 'Fonoaudiologia', 'Oftalmologia', 'Odontologia'], { message: 'El tipo no es una opcion valida. Clinica, Fonoaudiologia, Oftalmologia, Odontologia' })
  readonly type: ConsultaType;

  @ApiProperty({ description: 'Turno al que va el chico que asiste a la consulta' })
  @IsNotEmpty({ message: 'El turno no puede estar vacio' })
  @IsEnum(['Mañana', 'Tarde', 'Noche'], { message: 'El turno no es una opcion valida. Mañana, Tarde, Noche' })
  readonly turno: TurnoType;

  @ApiProperty({ description: 'Obra social de la consulta' })
  @IsNotEmpty({ message: 'La obra social no puede estar vacio' })
  @IsBoolean({ message: 'La obra social debe ser un boolean' })
  // @Transform(({ value }) => value.trim())
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

  @ApiProperty({ description: 'Derivaciones de la consulta' })
  @IsObject({ message: 'Las derivaciones deben ser un objeto' })
  @ValidateNested()
  @Type(() => DerivacionesDto)
  readonly derivaciones: DerivacionesType;

  @ApiProperty({ description: 'Observaciones de la consulta' })
  @IsString({ message: 'Las Observaciones debe ser un string' })
  @Length(1, 1000, { message: 'Las Observaciones deben tener entre 1 y 1000 caracteres' })
  @IsOptional()
  @Transform(({ value }) => value.trim())
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
