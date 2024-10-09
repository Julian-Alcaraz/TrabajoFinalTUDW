import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive, IsString, Length } from 'class-validator';
import { CreateClinicaDto } from './create-clinica.dto';

export class CreateConsultaDto {
  @ApiProperty({ description: 'Tipo de consulta' })
  // @IsNotEmpty({ message: 'El apellido no puede estar vacio' })
  @IsString({ message: 'El apellido debe ser un string' })
  @Length(1, 100, { message: 'El tipo debe tener entre 1 y 100 caracteres' })
  readonly type: string;
  @ApiProperty({ description: 'Obra social de la consulta' })
  // @IsNotEmpty({ message: 'El apellido no puede estar vacio' })
  @IsString({ message: 'La obra social debe ser un string' })
  @Length(1, 100, { message: 'La obra social debe tener entre 1 y 100 caracteres' })
  readonly obra_social: string;

  @ApiProperty({ description: 'Edad del niño que asiste' })
  @IsNotEmpty({ message: 'La edad no puede estar vacia' })
  @IsInt({ message: 'La edad debe ser un número' })
  @IsPositive({ message: 'La edad debe ser un numero positivo' })
  readonly edad: number;

  @ApiProperty({ description: 'El usuario que realiza la consulta' })
  @IsNotEmpty({ message: 'El id del usuario no puede estar vacio' })
  @IsInt({ message: 'El id del usuario debe ser un número' })
  @IsPositive({ message: 'El id del usuario debe ser un numero positivo' })
  readonly usuarioId: number;

  @ApiProperty({ description: 'La institucion a la que va el niño' })
  // @IsNotEmpty({ message: 'El id del usuario no puede estar vacio' })
  @IsInt({ message: 'El id de la institucion debe ser un número' })
  @IsPositive({ message: 'El id de la institucion debe ser un numero positivo' })
  readonly institucionId: number;

  @ApiProperty({ description: 'El curso al que va el niño' })
  // @IsNotEmpty({ message: 'El id del usuario no puede estar vacio' })
  @IsInt({ message: 'El id del curso debe ser un número' })
  @IsPositive({ message: 'El id del curso debe ser un numero positivo' })
  readonly cursoId: number;

  @ApiProperty({ description: 'Observaciones de la consulta' })
  // @IsNotEmpty({ message: 'El apellido no puede estar vacio' })
  @IsString({ message: 'Las Observaciones debe ser un string' })
  @Length(1, 1000, { message: 'La obra social debe tener entre 1 y 100 caracteres' })
  readonly observaciones: string;

  readonly clinica?: CreateClinicaDto;
  // readonly fonoudiologa?: CreateFonoudiologaDto;
  // readonly oftalmologa?: CreateOftalmologaDto;
}
