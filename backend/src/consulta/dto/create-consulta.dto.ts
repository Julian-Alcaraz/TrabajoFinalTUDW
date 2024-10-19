import { ApiProperty } from '@nestjs/swagger';
import { IsEmpty, IsEnum, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, Length, ValidateIf, ValidateNested } from 'class-validator';
import { CreateClinicaDto } from './create-clinica.dto';
import { consultaType } from '../entities/consulta.entity';
import { CreateFonoaudiologiaDto } from './create-fonoaudiologia.dto';
import { CreateOftalmologiaDto } from './create-oftalmologia.dto';
import { CreateOdontologiaDto } from './create-odontologia.dto';
import { Type } from 'class-transformer';
export class CreateConsultaDto {
  @ApiProperty({ description: 'Tipo de consulta' })
  @IsNotEmpty({ message: 'El tipo no puede estar vacio' })
  @IsEnum(['Clinica', 'Fonoaudiologia', 'Oftalmologia', 'Odontologia'], { message: 'El tipo no es una opcion valida. Clinica, Fonoaudiologia, Oftalmologia, Odontologia' })
  readonly type: consultaType;

  @ApiProperty({ description: 'Obra social de la consulta' })
  @IsNotEmpty({ message: 'La obra social no puede estar vacio' })
  @IsString({ message: 'La obra social debe ser un string' })
  @Length(1, 100, { message: 'La obra social debe tener entre 1 y 100 caracteres' })
  readonly obra_social: string;

  @ApiProperty({ description: 'Edad del niño que asiste' })
  @IsNotEmpty({ message: 'La edad no puede estar vacia' })
  @IsInt({ message: 'La edad debe ser un número' })
  @IsPositive({ message: 'La edad debe ser un numero positivo' })
  readonly edad: number;

  // este dato lo pueden mandar desde el front o lo podemos obtener del token de la consulta!!!!!!!
  // @ApiProperty({ description: 'El usuario que realiza la consulta' })
  // @IsNotEmpty({ message: 'El id del usuario no puede estar vacio' })
  // @IsInt({ message: 'El id del usuario debe ser un número' })
  // @IsPositive({ message: 'El id del usuario debe ser un numero positivo' })
  // readonly usuarioId: number;
  @ApiProperty({ description: 'El id del niño que va a la consulta' })
  @IsNotEmpty({ message: 'El id del niño no puede estar vacio' })
  @IsInt({ message: 'El id del niño debe ser un número' })
  @IsPositive({ message: 'El id del niño debe ser un numero positivo' })
  readonly chicoId: number;

  @ApiProperty({ description: 'La institucion a la que va el niño' })
  @IsNotEmpty({ message: 'El id de la institucion no puede estar vacio' })
  @IsInt({ message: 'El id de la institucion debe ser un número' })
  @IsPositive({ message: 'El id de la institucion debe ser un numero positivo' })
  readonly institucionId: number;

  @ApiProperty({ description: 'El curso al que va el niño' })
  @IsNotEmpty({ message: 'El id del curso no puede estar vacio' })
  @IsInt({ message: 'El id del curso debe ser un número' })
  @IsPositive({ message: 'El id del curso debe ser un numero positivo' })
  readonly cursoId: number;
  // este dato podria ser opcional!!!!!!!!!!
  @ApiProperty({ description: 'Observaciones de la consulta' })
  //@IsNotEmpty({ message: 'Las observaciones no puede estar vacio' })
  // LO CAMBIE A OPCIONAL
  @IsOptional()
  @IsString({ message: 'Las Observaciones debe ser un string' })
  @Length(1, 1000, { message: 'La obra social debe tener entre 1 y 100 caracteres' })
  readonly observaciones?: string;

  @ValidateIf((o) => o.type === 'Clinica')
  // @IsNotEmpty({ message: 'Los datos de la clínica no pueden estar vacíos cuando el tipo es Clínica' })
  // CAMBIE ESTO
  @IsEmpty({ message: 'Los datos de la clínica no pueden estar vacíos cuando el tipo es Clínica' })
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
