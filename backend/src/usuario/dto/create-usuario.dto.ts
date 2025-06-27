import { IsString, IsNotEmpty, Length, IsInt, IsEmail, Min, Max, IsPositive, IsArray, ArrayNotEmpty, IsNumber, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

export class CreateUsuarioDto {
  @ApiProperty({ description: 'Nombre del usuario' })
  @IsNotEmpty({ message: 'El nombre no puede estar vacio' })
  @IsString({ message: 'El nombre debe ser un string' })
  @Length(1, 50, { message: 'El nombre debe tener entre 1 y 50 caracteres' })
  @Transform(({ value }) => value.trim())
  readonly nombre: string;

  @ApiProperty({ description: 'Apellido del usuario' })
  @IsNotEmpty({ message: 'El apellido no puede estar vacio' })
  @IsString({ message: 'El apellido debe ser un string' })
  @Length(1, 50, { message: 'El apellido debe tener entre 1 y 50 caracteres' })
  @Transform(({ value }) => value.trim())
  readonly apellido: string;

  @ApiProperty({ description: 'Dni del usuario' })
  @IsNotEmpty({ message: 'El dni no puede estar vacio' })
  @IsInt({ message: 'El dni debe ser un entero' })
  @IsPositive({ message: 'El dni debe ser un numero positivo' })
  @Min(1000000, { message: 'El dni debe tener como mínimo 7 dígitos' })
  @Max(99999999, { message: 'El dni debe tener como máximo 8 dígitos' })
  readonly dni: number;

  @ApiProperty({ description: 'Email del usuario' })
  @IsNotEmpty({ message: 'El email no puede estar vacio' })
  @IsEmail({}, { message: 'El email debe ser un email' })
  @Length(1, 255, { message: 'El email debe tener entre 1 y 100 caracteres' })
  readonly email: string;

  @ApiProperty({ description: 'Contrasenia del usuario' })
  @IsNotEmpty({ message: 'La contrasenia no puede estar vacia' })
  @IsString({ message: 'La contrasenia debe ser un string' })
  @Length(7, 255, { message: 'La contrasenia debe tener entre 7 y 255 caracteres' })
  @Transform(({ value }) => value.trim())
  contrasenia: string; // no la hago readonly para poder modificarla en el caso de editar contraseña asi puedo hashear el valor

  @ApiProperty({ description: 'Fecha nacimiento del usuario' })
  @IsNotEmpty({ message: 'La fecha de no puede estar vacia' })
  @Type(() => Date)
  @IsDate({ message: 'La fecha de nacimiento no tiene formato correcto' })
  readonly fe_nacimiento: Date;

  @ApiProperty({ description: 'IDS de los roles relacionados con el menu' })
  @IsArray({ message: 'Los roles_ids deben ser un arreglo' })
  @ArrayNotEmpty({ message: 'El arreglo no puede estar vacio' })
  @IsNumber({}, { each: true, message: 'Cada elemento del arreglo debe ser un numero' })
  @IsPositive({ each: true, message: 'Cada elemento del arreglo debe ser un numero positivo' })
  @IsInt({ each: true, message: 'Cada elemento del arreglo debe ser un numero entero' })
  readonly roles_ids: number[];
}
