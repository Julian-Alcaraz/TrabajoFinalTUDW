import { IsString, IsNotEmpty, Length, IsInt, IsEmail, IsDateString, Min, Max, IsOptional, IsPositive, IsArray, ArrayNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUsuarioDto {
  @ApiProperty({ description: 'Nombre del usuario' })
  @IsNotEmpty({ message: 'El nombre no puede estar vacio' })
  @IsString({ message: 'El nombre debe ser un string' })
  @Length(1, 100, { message: 'El nombre debe tener entre 1 y 100 caracteres' })
  readonly nombre: string;

  @ApiProperty({ description: 'Apellido del usuario' })
  @IsNotEmpty({ message: 'El apellido no puede estar vacio' })
  @IsString({ message: 'El apellido debe ser un string' })
  @Length(1, 100, { message: 'El apellido debe tener entre 1 y 100 caracteres' })
  readonly apellido: string;

  @ApiProperty({ description: 'Dni del usuario' })
  @IsNotEmpty({ message: 'El dni no puede estar vacio' })
  @IsInt({ message: 'El dni debe ser un entero' })
  @IsPositive({ message: 'El dni debe ser un numero positivo' })
  @Min(10000000, { message: 'El dni debe tener 8 digitos' })
  @Max(99999999, { message: 'El dni debe tener 8 digitos' })
  readonly dni: number;

  @ApiProperty({ description: 'Email del usuario' })
  @IsNotEmpty({ message: 'El email no puede estar vacio' })
  @IsEmail({}, { message: 'El email debe ser un email' })
  readonly email: string;

  @ApiProperty({ description: 'Contrasenia del usuario' })
  @IsNotEmpty({ message: 'La contrasenia no puede estar vacia' })
  @IsString({ message: 'La contrasenia debe ser un string' })
  @Length(1, 100, { message: 'La contrasenia debe tener entre 1 y 100 caracteres' })
  readonly contrasenia: string;

  @ApiProperty({ description: 'Fecha de nacimiento del usuario' })
  @IsNotEmpty({ message: 'La fe_nacimiento no puede estar vacia' })
  @IsDateString({}, { message: 'La fe_nacimiento debe ser una fecha válida (formato ISO)' })
  readonly fe_nacimiento: string;

  @ApiProperty({ description: 'IDS de los roles relacionados con el menu' })
  @IsArray({ message: 'Los roles_ids deben ser un arreglo' })
  @ArrayNotEmpty({ message: 'El arreglo no puede estar vacio' })
  @IsNumber({}, { each: true, message: 'Cada elemento del arreglo debe ser un numero' })
  @IsPositive({ each: true, message: 'Cada elemento del arreglo debe ser un numero positivo' })
  @IsInt({ each: true, message: 'Cada elemento del arreglo debe ser un numero entero' })
  readonly roles_ids: number[];

  @ApiProperty({ description: 'Especialidad del usuario medico' })
  @IsNotEmpty({ message: 'La especialidad no puede estar vacia' })
  @IsString({ message: 'La especialidad debe ser un string' })
  @Length(1, 100, { message: 'La especialidad debe tener entre 1 y 100 caracteres' })
  @IsOptional()
  readonly especialidad?: string;
}
