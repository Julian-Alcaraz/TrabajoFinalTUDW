import { IsString, IsNotEmpty, Length, IsInt, IsEmail, IsDateString, Min, Max, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUsuarioDto {
  



  @ApiProperty({ description: 'Nombre del usuario' })
  @IsNotEmpty({ message: 'El nombre no puede estar vacio' })
  @IsString({ message: 'El nombre debe ser un string' })
  @Length(1, 100, { message: 'El nombre debe tener entre 1 y 100 caracteres' })
  nombre: string;

  @ApiProperty({ description: 'Apellido del usuario' })
  @IsNotEmpty({ message: 'El apellido no puede estar vacio' })
  @IsString({ message: 'El apellido debe ser un string' })
  @Length(1, 100, { message: 'El apellido debe tener entre 1 y 100 caracteres' })
  apellido: string;

  @ApiProperty({ description: 'Dni del usuario' })
  @IsNotEmpty({ message: 'El dni no puede estar vacio' })
  @IsInt({ message: 'El dni debe ser un entero' })
  //@Length(8, 8, { message: 'El DNI debe tener 8 digitos' })
  //@Matches(/^\d{8}$/, { message: 'El dni debe tener 8 digitos' })
  @Min(10000000, { message: 'El dni debe tener 8 digitos' })
  @Max(99999999, { message: 'El dni debe tener 8 digitos' })
  dni: number;

  @ApiProperty({ description: 'Email del usuario' })
  @IsNotEmpty({ message: 'El email no puede estar vacio' })
  @IsEmail({}, { message: 'El email debe ser un email' }) // Agregar lenght quiza
  email: string;

  @ApiProperty({ description: 'Contrasenia del usuario' })
  @IsNotEmpty({ message: 'La contrasenia no puede estar vacia' })
  @IsString({ message: 'La contrasenia debe ser un string' })
  @Length(1, 100, { message: 'La contrasenia debe tener entre 1 y 100 caracteres' })
  contrasenia: string;

  @ApiProperty({ description: 'Fecha de nacimiento del usuario' })
  @IsNotEmpty({ message: 'La fe_nacimiento no puede estar vacia' })
  @IsDateString({}, { message: 'La fe_nacimiento debe ser una fecha válida (formato ISO)' })
  fe_nacimiento: string;

  /* VER!!!!!!!!!!!!!!!!!!!*/
  @ApiProperty({ description: 'Especialidad del usuario medico' })
  @IsNotEmpty({ message: 'La especialidad no puede estar vacia' })
  @IsString({ message: 'La especialidad debe ser un string' })
  @Length(1, 100, { message: 'La especialidad debe tener entre 1 y 100 caracteres' })
  @IsOptional()
  especialidad?: string;
}
