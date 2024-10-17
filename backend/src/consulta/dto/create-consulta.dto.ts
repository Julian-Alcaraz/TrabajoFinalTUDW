import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsPositive, IsString, Length } from 'class-validator';
import { CreateClinicaDto } from './create-clinica.dto';
import { Type } from '../entities/consulta.entity';
import { CreateFonoaudiologiaDto } from './create-fonoaudiologia.dto';
import { CreateOftalmologiaDto } from './create-oftalmologia.dto';
import { CreateOdontologiaDto } from './create-odontologia.dto';
export class CreateConsultaDto {
  @ApiProperty({ description: 'Tipo de consulta' })
  @IsNotEmpty({ message: 'El tipo no puede estar vacio' })
  @IsEnum(['Clinica', 'Fonoaudiologia', 'Oftalmologia', 'Odontologia'], { message: 'El tipo no es una opcion valida. Clinica, Fonoaudiologia, Oftalmologia, Odontologia' })
  readonly type: Type;

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
  @ApiProperty({ description: 'El usuario que realiza la consulta' })
  @IsNotEmpty({ message: 'El id del usuario no puede estar vacio' })
  @IsInt({ message: 'El id del usuario debe ser un número' })
  @IsPositive({ message: 'El id del usuario debe ser un numero positivo' })
  readonly usuarioId: number;

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
  @IsNotEmpty({ message: 'Las observaciones no puede estar vacio' })
  @IsString({ message: 'Las Observaciones debe ser un string' })
  @Length(1, 1000, { message: 'La obra social debe tener entre 1 y 100 caracteres' })
  readonly observaciones: string;

  readonly clinica?: CreateClinicaDto;
  readonly fonoudiologa?: CreateFonoaudiologiaDto;
  readonly oftalmologa?: CreateOftalmologiaDto;
  readonly odontologia?: CreateOdontologiaDto;
}
