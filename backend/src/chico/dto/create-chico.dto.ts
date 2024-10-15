import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsInt, IsNotEmpty, IsPositive, IsString, Length, Max, Min } from 'class-validator';
import { sexoType } from '../entities/chico.entity';
import { Type } from 'class-transformer';

export class CreateChicoDto {
  @ApiProperty({ description: 'Dni del chico' })
  @IsNotEmpty({ message: 'El dni no puede estar vacio' })
  @IsInt({ message: 'El dni debe ser un entero' })
  @IsPositive({ message: 'El dni debe ser un numero positivo' })
  @Min(10000000, { message: 'El dni debe tener 8 digitos' })
  @Max(99999999, { message: 'El dni debe tener 8 digitos' })
  readonly dni: number;

  @ApiProperty({ description: 'Nombre del chico' })
  @IsNotEmpty({ message: 'El nombre no puede estar vacio' })
  @IsString({ message: 'El nombre debe ser un string' })
  @Length(3, 50, { message: 'El nombre debe tener entre 3 y 50 caracteres' })
  readonly nombre: string;

  @ApiProperty({ description: 'Apellido del chico' })
  @IsNotEmpty({ message: 'El apellido no puede estar vacio' })
  @IsString({ message: 'El apellido debe ser un string' })
  @Length(3, 50, { message: 'El apellido debe tener entre 3 y 50 caracteres' })
  readonly apellido: string;

  @ApiProperty({ description: 'Sexo del chico' })
  @IsNotEmpty({ message: 'El sexo no puede estar vacio' })
  @IsEnum(['Femenino', 'Masculino', 'Otro'])
  readonly sexo: sexoType;

  @ApiProperty({ description: 'Fecha nacimiento del chico.' })
  @IsNotEmpty({ message: 'La fecha de no puede estar vacia' })
  @Type(() => Date)
  @IsDate({ message: 'La fecha de nacimiento no tiene formato correcto' })
  readonly fe_nacimiento: Date;

  @ApiProperty({ description: 'Direccion del chico' })
  @IsNotEmpty({ message: 'La direccion no puede estar vacio' })
  @IsString({ message: 'La direccion debe ser un string' })
  @Length(1, 255, { message: 'La direccion debe tener entre 1 y 255 caracteres' })
  readonly direccion: string;

  @ApiProperty({ description: 'Telefono del chico' })
  @IsNotEmpty({ message: 'El telefono no puede estar vacio' })
  @IsString({ message: 'El telefono debe ser un string' })
  @Length(1, 50, { message: 'El telefono debe tener entre 1 y 15 caracteres' })
  readonly telefono: string;

  @ApiProperty({ description: 'Nombre madre del chico' })
  @IsNotEmpty({ message: 'El nombre de la madre no puede estar vacio' })
  @IsString({ message: 'El nombre de la madre debe ser un string' })
  @Length(1, 100, { message: 'El nombre de la madre debe tener entre 1 y 100 caracteres' })
  readonly nombre_madre: string;

  @ApiProperty({ description: 'Nombre padre del chico' })
  @IsNotEmpty({ message: 'El nombre del padre no puede estar vacio' })
  @IsString({ message: 'El nombre del padre debe ser un string' })
  @Length(1, 100, { message: 'El nombre del padre debe tener entre 1 y 100 caracteres' })
  readonly nombre_padre: string;

  @ApiProperty({ description: 'Id del barrio' })
  @IsNotEmpty({ message: 'El id del barrio no puede estar vacio' })
  @IsInt({ message: 'El id del barrio debe ser un entero' })
  @IsPositive({ message: 'El id del barrio debe ser un numero positivo' })
  readonly id_barrio: number;
}
